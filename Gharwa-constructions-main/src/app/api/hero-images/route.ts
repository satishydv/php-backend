import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gharwa_auth',
  port: parseInt(process.env.DB_PORT || '3306'),
};

export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT * FROM hero_images WHERE is_active = 1 ORDER BY display_order ASC'
    );
    
    await connection.end();
    
    // Add URL field to each image based on filename and convert boolean fields
    const imagesWithUrl = Array.isArray(rows) ? (rows as { filename: string; alt_text?: string; name?: string; is_active: number }[]).map((image) => ({
      ...image,
      url: `/Hero/${image.filename}`,
      alt: image.alt_text || image.name || 'Hero image',
      is_active: Boolean(image.is_active) // Convert 1/0 to true/false
    })) : [];
    
    return NextResponse.json(imagesWithUrl);
  } catch (error) {
    console.error('Error fetching hero images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero images' },
      { status: 500 }
    );
  }
}
