import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    const connection = await getConnection();

    // First verify the image exists
    const [checkImage] = await connection.execute('SELECT id FROM carousel_images WHERE id = ?', [id]);

    if (checkImage.length === 0) {
      await connection.end();
      return NextResponse.json({ error: 'Image not found in database' }, { status: 404 });
    }

    // Now delete it
    const [result] = await connection.execute('DELETE FROM carousel_images WHERE id = ?', [id]);
    await connection.end();

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Failed to delete image - database error' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting carousel image:', error);
    return NextResponse.json({ error: `Failed to delete carousel image: ${error.message}` }, { status: 500 });
  }
}
