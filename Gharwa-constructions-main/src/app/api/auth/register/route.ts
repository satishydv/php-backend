import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

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
    const { username, email, password } = await request.json();

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Connect to database
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Check if user already exists
      const [existingUsers] = await connection.execute(
        'SELECT id FROM users WHERE username = ? OR email = ?',
        [username, email]
      );

      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        return NextResponse.json(
          { error: 'Username or email already exists' },
          { status: 409 }
        );
      }

      // Insert new user
      const [result] = await connection.execute(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, passwordHash]
      );

      await connection.end();

      return NextResponse.json(
        { message: 'User registered successfully' },
        { status: 201 }
      );

    } catch (dbError) {
      await connection.end();
      throw dbError;
    }

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
