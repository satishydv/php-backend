import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { writeFile } from 'fs/promises';
import { join } from 'path';

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: process.env.MYSQL_PASSWORD || 'your_password_here',
  database: 'gharwa_auth'
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const mobile = formData.get('mobile') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const rating = parseInt(formData.get('rating') as string);
    const profileImage = formData.get('profileImage') as File;

    // Validate required fields
    if (!name || !email || !mobile || !message || !rating) {
      return NextResponse.json(
        { error: 'Name, email, mobile, message, and rating are required' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    let profileImagePath = null;

    // Handle profile image upload if provided
    if (profileImage && profileImage.size > 0) {
      const bytes = await profileImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = profileImage.name.split('.').pop();
      const filename = `review_${timestamp}_${Math.random().toString(36).substring(2)}.${fileExtension}`;
      
      // Save file to public/reviews directory
      const path = join(process.cwd(), 'public', 'reviews', filename);
      await writeFile(path, buffer);
      
      profileImagePath = `reviews/${filename}`;
    }

    // Connect to database
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Insert review into database
      const [result] = await connection.execute(
        'INSERT INTO reviews (name, email, mobile, subject, message, rating, profile_image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, email, mobile, subject || null, message, rating, profileImagePath, 'pending']
      );

      await connection.end();

      return NextResponse.json(
        { 
          message: 'Review submitted successfully! It will be reviewed before being published.',
          reviewId: (result as { insertId: number }).insertId
        },
        { status: 201 }
      );

    } catch (dbError) {
      await connection.end();
      throw dbError;
    }

  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit review. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Connect to database
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Get only active reviews for public display
      const [reviews] = await connection.execute(
        'SELECT id, name, subject, message, rating, profile_image, created_at FROM reviews WHERE status = "active" ORDER BY created_at DESC'
      );

      await connection.end();

      return NextResponse.json({ reviews }, { status: 200 });

    } catch (dbError) {
      await connection.end();
      throw dbError;
    }

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
