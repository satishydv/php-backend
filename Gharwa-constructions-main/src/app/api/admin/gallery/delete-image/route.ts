import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';
import jwt from 'jsonwebtoken';

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

    const formData = await request.formData();
    const filename = formData.get('filename') as string;

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }

    // Construct the full path to the image file
    const imagePath = join(process.cwd(), 'public', 'Gallery', filename);

    // Check if file exists and delete it
    try {
      await unlink(imagePath);
      console.log(`Image deleted successfully: ${imagePath}`);
      
      return NextResponse.json(
        { message: 'Image deleted successfully', filename },
        { status: 200 }
      );
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        // File doesn't exist
        console.log(`Image file not found: ${imagePath}`);
        return NextResponse.json(
          { message: 'Image file not found', filename },
          { status: 404 }
        );
      }
      throw error;
    }

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
