import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: process.env.MYSQL_PASSWORD || 'your_password_here',
  database: 'gharwa_auth'
};

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Middleware to verify admin authentication
async function verifyAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Access token required', status: 401 };
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string; email: string };
    return { user: decoded };
  } catch {
    return { error: 'Invalid or expired token', status: 401 };
  }
}

// GET - Fetch all reviews for admin management
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    // Connect to database
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Get all reviews with pagination
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '10');
      const status = url.searchParams.get('status') || '';
      const offset = (page - 1) * limit;

      // Build the base query
      const baseQuery = 'SELECT * FROM reviews';
      const countQuery = 'SELECT COUNT(*) as total FROM reviews';
      const whereClause = status ? ' WHERE status = ?' : '';
      
      // Build final queries
      const query = baseQuery + whereClause + ' ORDER BY created_at DESC LIMIT ' + limit + ' OFFSET ' + offset;
      const finalCountQuery = countQuery + whereClause;
      
      // Prepare parameters
      const params = status ? [status] : [];
      const countParams = status ? [status] : [];

      console.log('Executing query:', query);
      console.log('With params:', params);
      console.log('Count query:', finalCountQuery);
      console.log('Count params:', countParams);

      const [reviews] = await connection.execute(query, params);
      const [countResult] = await connection.execute(finalCountQuery, countParams);
      const total = (countResult as { total: number }[])[0].total;

      console.log('Reviews found:', reviews);
      console.log('Total count:', total);

      await connection.end();

      return NextResponse.json({
        reviews,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }, { status: 200 });

    } catch (dbError) {
      console.error('Database error:', dbError);
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

// PUT - Update review status
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Review ID and status are required' },
        { status: 400 }
      );
    }

    if (!['pending', 'active', 'inactive'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be pending, active, or inactive' },
        { status: 400 }
      );
    }

    // Connect to database
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Update review status
      const [result] = await connection.execute(
        'UPDATE reviews SET status = ?, updated_at = NOW() WHERE id = ?',
        [status, id]
      );

      if ((result as { affectedRows: number }).affectedRows === 0) {
        await connection.end();
        return NextResponse.json(
          { error: 'Review not found' },
          { status: 404 }
        );
      }

      await connection.end();

      return NextResponse.json(
        { message: 'Review status updated successfully' },
        { status: 200 }
      );

    } catch (dbError) {
      await connection.end();
      throw dbError;
    }

  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE - Delete review
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Get review data to delete associated image file
      const [reviews] = await connection.execute(
        'SELECT profile_image FROM reviews WHERE id = ?',
        [id]
      );

      if (Array.isArray(reviews) && reviews.length === 0) {
        await connection.end();
        return NextResponse.json(
          { error: 'Review not found' },
          { status: 404 }
        );
      }

      // Delete review from database
      const [result] = await connection.execute(
        'DELETE FROM reviews WHERE id = ?',
        [id]
      );

      await connection.end();

      // TODO: Delete associated image file from filesystem if needed
      // const review = reviews[0] as any;
      // if (review.profile_image) {
      //   const imagePath = join(process.cwd(), 'public', review.profile_image);
      //   await unlink(imagePath).catch(console.error);
      // }

      return NextResponse.json(
        { message: 'Review deleted successfully' },
        { status: 200 }
      );

    } catch (dbError) {
      await connection.end();
      throw dbError;
    }

  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
