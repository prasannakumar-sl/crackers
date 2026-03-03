import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const connection = await getConnection();
    const [settings] = await connection.execute(
      'SELECT * FROM settings WHERE setting_key = ? LIMIT 1',
      ['price_list_style']
    );
    await connection.end();

    if (settings.length === 0) {
      return NextResponse.json({ style: 'table' });
    }

    return NextResponse.json({ style: settings[0].setting_value });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ style: 'table' });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { style } = data;

    if (!style || !['cards', 'table'].includes(style)) {
      return NextResponse.json({ error: 'Invalid style value. Must be "cards" or "table"' }, { status: 400 });
    }

    const connection = await getConnection();
    
    // Check if setting exists
    const [existing] = await connection.execute(
      'SELECT id FROM settings WHERE setting_key = ? LIMIT 1',
      ['price_list_style']
    );

    if (existing.length > 0) {
      // Update existing
      await connection.execute(
        'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
        [style, 'price_list_style']
      );
    } else {
      // Insert new
      await connection.execute(
        'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
        ['price_list_style', style]
      );
    }

    await connection.end();

    return NextResponse.json({ style }, { status: 200 });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
