import { getConnection } from '@/lib/db';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    console.log('DELETE /api/products/', id);
    console.log('Product ID type:', typeof id);

    const numId = parseInt(id, 10);
    console.log('Parsed ID:', numId);

    const connection = await getConnection();
    console.log('Database connected. Executing DELETE...');

    const [result] = await connection.execute('DELETE FROM products WHERE id = ?', [numId]);

    console.log('Delete result:', result);
    console.log('Affected rows:', result.affectedRows);

    await connection.end();

    if (result.affectedRows === 0) {
      console.error('Product not found with ID:', numId);
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    console.log('Product deleted successfully');
    return Response.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    console.error('Full error:', error);
    return Response.json({ error: `Failed to delete product: ${error.message}` }, { status: 500 });
  }
}
