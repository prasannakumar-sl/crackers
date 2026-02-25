import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM company_info LIMIT 1');
    await connection.end();

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Company info not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching company info:', error);
    return NextResponse.json({ error: 'Failed to fetch company info' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { company_name, phone_number, gst_number, email, address, website, logo } = data;

    const connection = await getConnection();

    // Check if company info exists
    const [rows] = await connection.execute('SELECT id FROM company_info LIMIT 1');

    if (rows.length === 0) {
      // Insert if doesn't exist
      const query = `
        INSERT INTO company_info (company_name, phone_number, gst_number, email, address, website, logo)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await connection.execute(query, [company_name, phone_number, gst_number, email, address, website, logo]);
      await connection.end();

      return NextResponse.json({
        id: result.insertId,
        company_name,
        phone_number,
        gst_number,
        email,
        address,
        website,
        logo,
      }, { status: 201 });
    } else {
      // Update existing
      const query = `
        UPDATE company_info
        SET company_name = ?, phone_number = ?, gst_number = ?, email = ?, address = ?, website = ?, logo = ?
        WHERE id = ?
      `;
      await connection.execute(query, [company_name, phone_number, gst_number, email, address, website, logo, rows[0].id]);
      await connection.end();

      return NextResponse.json({
        id: rows[0].id,
        company_name,
        phone_number,
        gst_number,
        email,
        address,
        website,
        logo,
      }, { status: 200 });
    }
  } catch (error) {
    console.error('Error updating company info:', error);
    return NextResponse.json({ error: `Failed to update company info: ${error.message}` }, { status: 500 });
  }
}
