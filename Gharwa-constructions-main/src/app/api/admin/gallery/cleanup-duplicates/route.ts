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

// POST - Clean up duplicate gallery images
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

    const connection = await mysql.createConnection(dbConfig);

    try {
      // Find duplicate filenames
      const [duplicates] = await connection.execute(`
        SELECT filename, COUNT(*) as count, GROUP_CONCAT(id ORDER BY id) as ids
        FROM gallery_images 
        GROUP BY filename 
        HAVING COUNT(*) > 1
      `);

      if (!Array.isArray(duplicates) || duplicates.length === 0) {
        await connection.end();
        return NextResponse.json({
          message: 'No duplicate images found',
          cleaned: 0
        });
      }

      let totalCleaned = 0;

      // For each duplicate filename, keep the first (lowest ID) and delete the rest
      for (const duplicate of duplicates as { filename: string; count: number; ids: string }[]) {
        const ids = duplicate.ids.split(',').map((id: string) => parseInt(id.trim()));
        const keepId = ids[0]; // Keep the first (oldest) record
        const deleteIds = ids.slice(1); // Delete the rest

        // Delete the duplicate records
        for (const deleteId of deleteIds) {
          await connection.execute(
            'DELETE FROM gallery_images WHERE id = ?',
            [deleteId]
          );
          totalCleaned++;
        }

        console.log(`Cleaned duplicates for ${duplicate.filename}: kept ID ${keepId}, deleted IDs ${deleteIds.join(', ')}`);
      }

      await connection.end();

      return NextResponse.json({
        message: `Cleaned up ${totalCleaned} duplicate images`,
        cleaned: totalCleaned,
        duplicates: duplicates
      });

    } catch (dbError) {
      await connection.end();
      throw dbError;
    }

  } catch (error) {
    console.error('Error cleaning up duplicates:', error);
    return NextResponse.json(
      { error: 'Failed to clean up duplicates' },
      { status: 500 }
    );
  }
}
