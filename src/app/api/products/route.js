import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const connection = await getConnection();
    const [products] = await connection.execute('SELECT * FROM products ORDER BY created_at DESC');
    await connection.end();

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const price = formData.get('price');
    const description = formData.get('description');
    const category = formData.get('category');
    const quantity = formData.get('quantity');
    const imageFile = formData.get('image');

    console.log('POST /api/products - Received data:', { name, price, description, category, quantity, hasImage: !!imageFile });

    if (!name || !price) {
      console.error('Validation error: Missing name or price');
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }

    // Handle image upload
    let imageData = null;
    if (imageFile && imageFile.size > 0) {
      const buffer = await imageFile.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      imageData = `data:${imageFile.type};base64,${base64}`;
      console.log('Image uploaded and converted to base64');
    }

    console.log('Connecting to database...');
    const connection = await getConnection();
    console.log('Database connected. Executing INSERT...');

    const query = 'INSERT INTO products (name, price, description, category, image, quantity) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await connection.execute(query, [name, price, description, category, imageData, quantity]);

    console.log('INSERT successful. ID:', result.insertId);
    await connection.end();

    return NextResponse.json({
      id: result.insertId,
      name,
      price,
      description,
      category,
      image: imageData,
      quantity,
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error.message);
    console.error('Full error:', error);
    return NextResponse.json({ error: `Failed to add product: ${error.message}` }, { status: 500 });
  }
}
