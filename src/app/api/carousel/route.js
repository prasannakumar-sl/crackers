import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { resizeAndConvertToBase64 } from '@/lib/imageProcessor';

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
    imageUrl = await resizeAndConvertToBase64(imageUrl);

    const connection = await getConnection();
    const query = 'INSERT INTO carousel_images (image_url, display_order) VALUES (?, ?)';
    const [result] = await connection.execute(query, [imageUrl, displayOrder]);
    await connection.end();

    return NextResponse.json({
      id: result.insertId,
      image_url: imageUrl,
      display_order: displayOrder,
      is_active: true,
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding carousel image:', error);
    return NextResponse.json({ error: 'Failed to add carousel image' }, { status: 500 });
  }
}
