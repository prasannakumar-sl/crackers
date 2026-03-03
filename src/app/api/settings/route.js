import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const connection = await getConnection();
    const [settings] = await connection.execute(
      'SELECT * FROM settings WHERE setting_key IN (?, ?)',
      ['price_list_style', 'home_page_decoration']
    );
    await connection.end();

    const result = {
      style: 'table',
      homePageDecoration: null,
    };

    settings.forEach(setting => {
      if (setting.setting_key === 'price_list_style') {
        result.style = setting.setting_value;
      } else if (setting.setting_key === 'home_page_decoration') {
        result.homePageDecoration = setting.setting_value;
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ style: 'table', homePageDecoration: null });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { style, homePageDecoration } = data;

    const connection = await getConnection();

    // Update style if provided
    if (style) {
      if (!['cards', 'table'].includes(style)) {
        return NextResponse.json({ error: 'Invalid style value. Must be "cards" or "table"' }, { status: 400 });
      }

      const [existing] = await connection.execute(
        'SELECT id FROM settings WHERE setting_key = ? LIMIT 1',
        ['price_list_style']
      );

      if (existing.length > 0) {
        await connection.execute(
          'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
          [style, 'price_list_style']
        );
      } else {
        await connection.execute(
          'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
          ['price_list_style', style]
        );
      }
    }

    // Update home page decoration if provided
    if (homePageDecoration) {
      const [existing] = await connection.execute(
        'SELECT id FROM settings WHERE setting_key = ? LIMIT 1',
        ['home_page_decoration']
      );

      if (existing.length > 0) {
        await connection.execute(
          'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
          [homePageDecoration, 'home_page_decoration']
        );
      } else {
        await connection.execute(
          'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
          ['home_page_decoration', homePageDecoration]
        );
      }
    }

    await connection.end();

    return NextResponse.json({ style, homePageDecoration }, { status: 200 });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
