import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gharwa_auth',
  port: parseInt(process.env.DB_PORT || '3306'),
};

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Helper function to verify admin token
async function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string; email: string };
    return decoded;
  } catch {
    return null;
  }
}

// POST - Upload gallery image
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const decoded = await verifyAdminToken(request);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const image = formData.get('image') as File;
    const name = formData.get('name') as string;
    const alt = formData.get('alt') as string;
    const imageId = formData.get('imageId') as string; // For image replacement
    const originalFilename = formData.get('originalFilename') as string; // For image replacement

    if (!image || !name || !alt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Determine filename - use original filename for replacement, or generate new one
    let filename: string;
    if (imageId && originalFilename) {
      // Image replacement - keep the original filename
      filename = originalFilename;
    } else {
      // New image - generate filename from uploaded file's name
      const uploadedFilename = image.name;
      const fileExtension = uploadedFilename.split('.').pop()?.toLowerCase();
      const baseName = uploadedFilename.replace(/\.[^/.]+$/, ""); // Remove extension
      const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, '-'); // Sanitize filename
      filename = `${sanitizedBaseName}.${fileExtension}`;
    }

    // Validate file type
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'Gallery');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Convert file to buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file to public/Gallery directory
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    // Connect to database and save image info
    const connection = await mysql.createConnection(dbConfig);

    try {
      let imageId;
      let isUpdate = false;

      if (imageId && originalFilename) {
        // Image replacement - update existing record by ID
        await connection.execute(
          'UPDATE gallery_images SET name = ?, alt_text = ?, updated_at = NOW() WHERE id = ?',
          [name, alt, imageId]
        );
        
        isUpdate = true;
        console.log(`Updated existing gallery image ID ${imageId}: ${filename}`);
      } else {
        // New image - check if filename already exists
        const [existingResult] = await connection.execute(
          'SELECT id, display_order FROM gallery_images WHERE filename = ?',
          [filename]
        );

        if (Array.isArray(existingResult) && existingResult.length > 0) {
          // Update existing record by filename
          const existingImage = existingResult[0] as { id: number };
          imageId = existingImage.id;
          
          await connection.execute(
            'UPDATE gallery_images SET name = ?, alt_text = ?, updated_at = NOW() WHERE filename = ?',
            [name, alt, filename]
          );
          
          isUpdate = true;
          console.log(`Updated existing gallery image: ${filename}`);
        } else {
          // Create new record
          const [orderResult] = await connection.execute(
            'SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM gallery_images'
          );
          const nextOrder = (orderResult as { next_order: number }[])[0]?.next_order || 1;

          const [result] = await connection.execute(
            'INSERT INTO gallery_images (name, filename, alt_text, display_order, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
            [name, filename, alt, nextOrder, true]
          );

          const insertResult = result as { insertId: number };
          imageId = insertResult.insertId;
          console.log(`Created new gallery image: ${filename}`);
        }
      }

      await connection.end();

      return NextResponse.json({
        message: isUpdate ? 'Image updated successfully' : 'Image uploaded successfully',
        imageId: imageId,
        filename: filename,
        url: `/Gallery/${filename}`,
        isUpdate: isUpdate
      });

    } catch (dbError) {
      // If database insert fails, delete the uploaded file
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (fileError) {
        console.error('Error deleting file after DB failure:', fileError);
      }
      
      await connection.end();
      throw dbError;
    }

  } catch (error) {
    console.error('Error uploading gallery image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}