import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

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

    const { filename, name, alt } = await request.json();

    if (!filename || !name || !alt) {
      return NextResponse.json(
        { error: 'Filename, name, and alt text are required' },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(dbConfig);
    
    // Update the image metadata in the database
    await connection.execute(
      'UPDATE hero_images SET name = ?, alt_text = ?, updated_at = NOW() WHERE filename = ?',
      [name, alt, filename]
    );
    
    await connection.end();
    
    console.log(`Updated metadata for hero image: ${filename}`);
    
    return NextResponse.json(
      { 
        message: 'Hero image metadata updated successfully',
        filename,
        name,
        alt
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating hero image metadata:', error);
    return NextResponse.json(
      { error: 'Failed to update hero image metadata' },
      { status: 500 }
    );
  }
}
