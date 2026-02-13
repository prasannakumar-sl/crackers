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

export async function GET() {
  try {
    const connection = await getConnection();
    
    // Fetch all orders
    const [orders] = await connection.execute(
      'SELECT * FROM orders ORDER BY created_at DESC'
    );

    // Fetch items for each order (In a real app, you might want to join or fetch separately)
    // For simplicity in this admin view, we'll just return the orders first
    // If the admin needs details, we can provide another endpoint or fetch items here

    await connection.end();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: `Failed to fetch orders: ${error.message}` }, { status: 500 });
  }
}
