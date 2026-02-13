import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  let connection;
  try {
    connection = await getConnection();
    const [sections] = await connection.execute('SELECT * FROM product_sections ORDER BY display_order ASC');

    // Fetch products for each section sequentially to avoid connection issues
    const sectionsWithProducts = [];
    for (const section of sections) {
      const [products] = await connection.execute(
        `SELECT p.* FROM products p
         INNER JOIN section_products sp ON p.id = sp.product_id
         WHERE sp.section_id = ?
         ORDER BY sp.display_order ASC`,
        [section.id]
      );
      sectionsWithProducts.push({
        ...section,
        products: products || [],
      });
    }

    await connection.end();
    return NextResponse.json(sectionsWithProducts);
  } catch (error) {
    console.error('Error fetching sections:', error.message);
    if (connection) {
      try {
        await connection.end();
      } catch (e) {
        console.error('Error closing connection:', e);
      }
    }
    return NextResponse.json({ error: `Failed to fetch sections: ${error.message}` }, { status: 500 });
  }
}

export async function POST(request) {
  let connection;
  try {
    const { title, displayOrder = 0 } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    connection = await getConnection();
    const [result] = await connection.execute(
      'INSERT INTO product_sections (title, display_order) VALUES (?, ?)',
      [title, displayOrder]
    );

    const [newSection] = await connection.execute(
      'SELECT * FROM product_sections WHERE id = ?',
      [result.insertId]
    );

    await connection.end();

    return NextResponse.json(
      { ...newSection[0], products: [] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating section:', error.message);
    if (connection) {
      try {
        await connection.end();
      } catch (e) {
        console.error('Error closing connection:', e);
      }
    }
    return NextResponse.json({ error: `Failed to create section: ${error.message}` }, { status: 500 });
  }
}
