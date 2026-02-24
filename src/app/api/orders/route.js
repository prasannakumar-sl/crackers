import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(request) {
  let connection;
  try {
    const orderData = await request.json();
    const { customerName, phone, email, address, totalAmount, itemCount, items } = orderData;

    connection = await getConnection();
    await connection.beginTransaction();

    // Insert into orders table
    const [orderResult] = await connection.execute(
      'INSERT INTO orders (customer_name, phone, email, address, total_amount, item_count) VALUES (?, ?, ?, ?, ?, ?)',
      [customerName, phone, email, address, totalAmount, itemCount]
    );

    const orderId = orderResult.insertId;
    const invoiceNumber = `invno_${String(orderId).padStart(8, '0')}`;

    // Update invoice number
    await connection.execute(
      'UPDATE orders SET invoice_number = ? WHERE id = ?',
      [invoiceNumber, orderId]
    );

    // Insert into order_items table
    for (const item of items) {
      const price = typeof item.discount === 'number' 
        ? item.discount 
        : parseFloat(item.discount.replace('₹', ''));
        
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.id || null, item.name, item.quantity, price]
      );
    }

    await connection.commit();
    await connection.end();

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    if (connection) {
      await connection.rollback();
      await connection.end();
    }
    console.error('Error creating order:', error);
    return NextResponse.json({ error: `Failed to create order: ${error.message}` }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    const connection = await getConnection();

    if (orderId) {
      // Fetch specific order with items
      const [orderData] = await connection.execute(
        'SELECT * FROM orders WHERE id = ?',
        [orderId]
      );

      if (orderData.length === 0) {
        await connection.end();
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      const [orderItems] = await connection.execute(
        'SELECT * FROM order_items WHERE order_id = ?',
        [orderId]
      );

      const [companyInfo] = await connection.execute('SELECT * FROM company_info LIMIT 1');

      await connection.end();

      return NextResponse.json({
        order: orderData[0],
        items: orderItems,
        company: companyInfo[0] || null
      });
    } else {
      // Fetch all orders
      const [orders] = await connection.execute(
        'SELECT * FROM orders ORDER BY created_at DESC'
      );

      await connection.end();
      return NextResponse.json(orders);
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: `Failed to fetch orders: ${error.message}` }, { status: 500 });
  }
}
