import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const connection = await getConnection();
    const [settings] = await connection.execute(
      'SELECT * FROM settings WHERE setting_key IN (?, ?, ?, ?, ?)',
      ['price_list_style', 'home_page_decoration', 'home_page_banners', 'home_page_brands', 'navbar_color']
    );
    await connection.end();

    const result = {
      style: 'table',
      homePageDecoration: null,
      navbarColor: '#1d4f4f',
      brands: ['Renu Crackers', 'Mightloads', 'Sri Aravind', 'Ramesh'],
      banners: [
        {
          id: 1,
          title: 'Perfect Collection',
          subtitle: 'Customize & Diwali',
          gradientFrom: 'from-green-700',
          gradientTo: 'to-green-900',
        },
        {
          id: 2,
          title: 'Festival',
          subtitle: 'Sale on All Items',
          gradientFrom: 'from-yellow-500',
          gradientTo: 'to-yellow-700',
        },
        {
          id: 3,
          title: 'Special Offer',
          subtitle: 'Limited Time Only',
          gradientFrom: 'from-orange-500',
          gradientTo: 'to-orange-700',
        },
      ],
    };

    settings.forEach(setting => {
      if (setting.setting_key === 'price_list_style') {
        result.style = setting.setting_value;
      } else if (setting.setting_key === 'home_page_decoration') {
        result.homePageDecoration = setting.setting_value;
      } else if (setting.setting_key === 'home_page_banners') {
        try {
          result.banners = JSON.parse(setting.setting_value);
        } catch (e) {
          console.error('Error parsing banners JSON:', e);
        }
      } else if (setting.setting_key === 'home_page_brands') {
        try {
          result.brands = JSON.parse(setting.setting_value);
        } catch (e) {
          console.error('Error parsing brands JSON:', e);
        }
      } else if (setting.setting_key === 'navbar_color') {
        result.navbarColor = setting.setting_value;
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({
      style: 'table',
      homePageDecoration: null,
      navbarColor: '#1d4f4f',
      banners: [
        {
          id: 1,
          title: 'Perfect Collection',
          subtitle: 'Customize & Diwali',
          gradientFrom: 'from-green-700',
          gradientTo: 'to-green-900',
        },
        {
          id: 2,
          title: 'Festival',
          subtitle: 'Sale on All Items',
          gradientFrom: 'from-yellow-500',
          gradientTo: 'to-yellow-700',
        },
        {
          id: 3,
          title: 'Special Offer',
          subtitle: 'Limited Time Only',
          gradientFrom: 'from-orange-500',
          gradientTo: 'to-orange-700',
        },
      ],
    });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { style, homePageDecoration, banners, brands, navbarColor } = data;

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
    if (homePageDecoration !== undefined) {
      const [existing] = await connection.execute(
        'SELECT id FROM settings WHERE setting_key = ? LIMIT 1',
        ['home_page_decoration']
      );

      if (homePageDecoration === null) {
        // Delete the setting
        if (existing.length > 0) {
          await connection.execute(
            'DELETE FROM settings WHERE setting_key = ?',
            ['home_page_decoration']
          );
        }
      } else {
        // Update or insert
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
    }

    // Update banners if provided
    if (banners !== undefined) {
      const bannersJSON = JSON.stringify(banners);
      const [existing] = await connection.execute(
        'SELECT id FROM settings WHERE setting_key = ? LIMIT 1',
        ['home_page_banners']
      );

      if (existing.length > 0) {
        await connection.execute(
          'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
          [bannersJSON, 'home_page_banners']
        );
      } else {
        await connection.execute(
          'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
          ['home_page_banners', bannersJSON]
        );
      }
    }

    // Update brands if provided
    if (brands !== undefined) {
      const brandsJSON = JSON.stringify(brands);
      const [existing] = await connection.execute(
        'SELECT id FROM settings WHERE setting_key = ? LIMIT 1',
        ['home_page_brands']
      );

      if (existing.length > 0) {
        await connection.execute(
          'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
          [brandsJSON, 'home_page_brands']
        );
      } else {
        await connection.execute(
          'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
          ['home_page_brands', brandsJSON]
        );
      }
    }

    // Update navbar color if provided
    if (navbarColor !== undefined) {
      const [existing] = await connection.execute(
        'SELECT id FROM settings WHERE setting_key = ? LIMIT 1',
        ['navbar_color']
      );

      if (existing.length > 0) {
        await connection.execute(
          'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
          [navbarColor, 'navbar_color']
        );
      } else {
        await connection.execute(
          'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
          ['navbar_color', navbarColor]
        );
      }
    }

    await connection.end();

    return NextResponse.json({ style, homePageDecoration, banners, brands, navbarColor }, { status: 200 });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
