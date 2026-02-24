import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const connection = await getConnection();
    const [products] = await connection.execute('SELECT * FROM products ORDER BY created_at DESC');
    await connection.end();

    // Provide default cracker image for products without images
    const defaultImage = 'https://cdn.builder.io/api/v1/image/assets%2Fa8b7ea913e4d4cbb918cc3633423e9fa%2Fcf0b1bff048f4f4aa4c2904d1907c926?format=webp&width=800&height=1200';

    const productsWithImages = products.map(product => ({
      ...product,
      image: product.image || defaultImage
    }));

    return NextResponse.json(productsWithImages);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type');
    let name, price, description, category, quantity, imageData = null;

    if (contentType && contentType.includes('application/json')) {
      // Handle JSON request (from admin panel)
      const data = await request.json();
      name = data.name;
      price = data.price;
      description = data.description;
      category = data.category;
      quantity = data.quantity;
      imageData = data.image;
    } else {
      // Handle FormData request
      const formData = await request.formData();
      name = formData.get('name');
      price = formData.get('price');
      description = formData.get('description');
      category = formData.get('category');
      quantity = formData.get('quantity');
      const imageFile = formData.get('image');

      if (imageFile && imageFile.size > 0) {
        const buffer = await imageFile.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        imageData = `data:${imageFile.type};base64,${base64}`;
      }
    }

    console.log('POST /api/products - Received data:', { name, price, description, category, quantity, hasImage: !!imageData });

    if (!name || !price) {
      console.error('Validation error: Missing name or price');
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
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
