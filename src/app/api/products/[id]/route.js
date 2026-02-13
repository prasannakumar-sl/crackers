import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    console.log('DELETE request for product ID:', id);
    console.log('ID type:', typeof id);

    if (!id) {
      console.error('DELETE error: No ID provided in params');
      return NextResponse.json({ error: 'No product ID provided' }, { status: 400 });
    }

    const numId = parseInt(id, 10);
    console.log('Parsed numeric ID:', numId);

    if (isNaN(numId)) {
      console.error('DELETE error: Invalid ID format:', id);
      return NextResponse.json({ error: 'Invalid product ID format' }, { status: 400 });
    }

    const connection = await getConnection();
    console.log('Database connected. Executing DELETE for ID:', numId);

    const [result] = await connection.execute('DELETE FROM products WHERE id = ?', [numId]);

    console.log('Delete query result:', result);
    console.log('Rows affected:', result.affectedRows);

    await connection.end();

    if (result.affectedRows === 0) {
      console.error('Product not found in database with ID:', numId);
      return NextResponse.json({ error: 'Product not found in database' }, { status: 404 });
    }

    console.log('Product deleted successfully from database');
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/products/[id]:', error.message);
    console.error('Full error details:', error);
    return NextResponse.json({ error: `Failed to delete product: ${error.message}` }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'No product ID provided' }, { status: 400 });
    }

    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return NextResponse.json({ error: 'Invalid product ID format' }, { status: 400 });
    }

    const connection = await getConnection();

    // Currently only supporting clearing the image
    if ('image' in body && body.image === null) {
      const [result] = await connection.execute(
        'UPDATE products SET image = NULL WHERE id = ?',
        [numId]
      );
      await connection.end();

      if (result.affectedRows === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: 'Product image removed successfully' });
    }

    await connection.end();
    return NextResponse.json({ error: 'Unsupported update operation' }, { status: 400 });
  } catch (error) {
    console.error('Error in PATCH /api/products/[id]:', error.message);
    return NextResponse.json({ error: `Failed to update product: ${error.message}` }, { status: 500 });
  }
}
