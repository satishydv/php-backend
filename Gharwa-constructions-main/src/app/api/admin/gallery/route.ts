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

// DELETE - Delete gallery image
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    const decoded = await verifyAdminToken(request);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Get image details before deletion
      const [rows] = await connection.execute(
        'SELECT filename FROM gallery_images WHERE id = ?',
        [id]
      );

      if (!Array.isArray(rows) || rows.length === 0) {
        await connection.end();
        return NextResponse.json(
          { error: 'Image not found' },
          { status: 404 }
        );
      }

      const image = rows[0] as { filename: string };
      const filename = image.filename;

      // Delete from database
      await connection.execute(
        'DELETE FROM gallery_images WHERE id = ?',
        [id]
      );

      await connection.end();

      // Delete physical file
      if (filename) {
        const filePath = path.join(process.cwd(), 'public', 'Gallery', filename);
        
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${filePath}`);
          }
        } catch (fileError) {
          console.error('Error deleting file:', fileError);
          // Don't fail the request if file deletion fails
        }
      }

      return NextResponse.json({
        message: 'Image deleted successfully',
        deletedId: id
      });

    } catch (dbError) {
      await connection.end();
      throw dbError;
    }

  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

// PUT - Update gallery image
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const decoded = await verifyAdminToken(request);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, name, alt_text, is_active } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    const connection = await mysql.createConnection(dbConfig);

    try {
      const [result] = await connection.execute(
        'UPDATE gallery_images SET name = ?, alt_text = ?, is_active = ?, updated_at = NOW() WHERE id = ?',
        [name, alt_text, is_active, id]
      );

      await connection.end();

      return NextResponse.json({
        message: 'Image updated successfully',
        id: id
      });

    } catch (dbError) {
      await connection.end();
      throw dbError;
    }

  } catch (error) {
    console.error('Error updating gallery image:', error);
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    );
  }
}
