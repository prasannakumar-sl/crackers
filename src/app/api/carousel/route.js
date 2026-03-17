import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { getConnection } from '@/lib/db';
import { resizeAndConvertToBase64 } from '@/lib/imageProcessor';

const CAROUSEL_DIR = join(process.cwd(), 'public', 'carousel');

export async function GET() {
  try {
    const connection = await getConnection();
    const [images] = await connection.execute(
      'SELECT * FROM carousel_images WHERE is_active = true ORDER BY display_order ASC'
    );
    await connection.end();

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching carousel images:', error);
    return NextResponse.json({ error: 'Failed to fetch carousel images' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    let { imageUrl, displayOrder = 0 } = data;

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // Resize image to standardized size
    const resizedImageBase64 = await resizeAndConvertToBase64(imageUrl);

    // Create carousel directory if it doesn't exist
    await mkdir(CAROUSEL_DIR, { recursive: true });

    // Generate filename with timestamp
    const timestamp = Date.now();
    const filename = `carousel-${timestamp}.jpg`;
    const filepath = join(CAROUSEL_DIR, filename);

    // Extract base64 data and write to file
    const base64Data = resizedImageBase64.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    await writeFile(filepath, buffer);

    // Store relative path in database
    const imageRelativePath = `/carousel/${filename}`;

    const connection = await getConnection();
    const query = 'INSERT INTO carousel_images (image_url, display_order) VALUES (?, ?)';
    const [result] = await connection.execute(query, [imageRelativePath, displayOrder]);
    await connection.end();

    return NextResponse.json({
      id: result.insertId,
      image_url: imageRelativePath,
      display_order: displayOrder,
      is_active: true,
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding carousel image:', error);
    return NextResponse.json({ error: 'Failed to add carousel image' }, { status: 500 });
  }
}
