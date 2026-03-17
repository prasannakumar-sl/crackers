import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const connection = await getConnection();
    const [settings] = await connection.execute(
      'SELECT * FROM settings WHERE setting_key IN (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['price_list_style', 'home_page_decoration', 'home_page_banners', 'home_page_brands', 'navbar_color', 'dark_background_color', 'navy_background_color', 'gold_accent_color', 'paradise_text', 'paradise_background_color', 'testimonial_data', 'blog_posts_data', 'show_paradise_animation', 'show_carousel_images']
    );
    await connection.end();

    const result = {
      style: 'table',
      homePageDecoration: null,
      navbarColor: '#1d4f4f',
      darkBackground: '#0f1e3d',
      navyBackground: '#1a2847',
      goldAccent: '#d4a574',
      paradiseText: 'PARADISE',
      paradiseBackgroundColor: '#f3f4f6',
      showParadiseAnimation: true,
      showCarouselImages: true,
      testimonial: {
        title: 'CRACKERS INDIA',
        heading: 'Client Says About Us',
        quote: 'We have been sourcing crackers from pk crackers for the past 5 years. The quality is consistently excellent, and their customer service is outstanding. They have helped us grow our business significantly.',
        attribution: 'Satisfied Customer'
      },
      blogPosts: [
        { id: 1, title: 'How to Choose the Best Crackers?', image: '🎆' },
        { id: 2, title: 'Firecrackers Safety Guide', image: '⚠️' },
        { id: 3, title: 'Diwali Crackers Online Shopping', image: '🛒' },
        { id: 4, title: 'Diwali Crackers for Kids and Safe Celebration', image: '👨‍👩‍👧‍👦' },
      ],
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
      } else if (setting.setting_key === 'dark_background_color') {
        result.darkBackground = setting.setting_value;
      } else if (setting.setting_key === 'navy_background_color') {
        result.navyBackground = setting.setting_value;
      } else if (setting.setting_key === 'gold_accent_color') {
        result.goldAccent = setting.setting_value;
      } else if (setting.setting_key === 'paradise_text') {
        result.paradiseText = setting.setting_value;
      } else if (setting.setting_key === 'paradise_background_color') {
        result.paradiseBackgroundColor = setting.setting_value;
      } else if (setting.setting_key === 'testimonial_data') {
        try {
          result.testimonial = JSON.parse(setting.setting_value);
        } catch (e) {
          console.error('Error parsing testimonial JSON:', e);
        }
      } else if (setting.setting_key === 'blog_posts_data') {
        try {
          result.blogPosts = JSON.parse(setting.setting_value);
        } catch (e) {
          console.error('Error parsing blog posts JSON:', e);
        }
      } else if (setting.setting_key === 'show_paradise_animation') {
        result.showParadiseAnimation = setting.setting_value === '1' || setting.setting_value === true;
      } else if (setting.setting_key === 'show_carousel_images') {
        result.showCarouselImages = setting.setting_value === '1' || setting.setting_value === true;
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({
      style: 'table',
      homePageDecoration: null,
      navbarColor: '#1d4f4f',
      darkBackground: '#0f1e3d',
      navyBackground: '#1a2847',
      goldAccent: '#d4a574',
      paradiseText: 'PARADISE',
      paradiseBackgroundColor: '#f3f4f6',
      showParadiseAnimation: true,
      showCarouselImages: true,
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
    const { style, homePageDecoration, banners, brands, navbarColor, darkBackground, navyBackground, goldAccent, paradiseText, paradiseBackgroundColor, testimonial, blogPosts, showParadiseAnimation, showCarouselImages } = data;

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

    // Update dark background color if provided
    if (darkBackground !== undefined) {
      const [existing] = await connection.execute(
        'SELECT id FROM settings WHERE setting_key = ? LIMIT 1',
        ['dark_background_color']
      );

      if (existing.length > 0) {
        await connection.execute(
          'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
          [darkBackground, 'dark_background_color']
        );
      } else {
        await connection.execute(
          'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
          ['dark_background_color', darkBackground]
        );
      }
    }

    // Update navy background color if provided
    if (navyBackground !== undefined) {
      const [existing] = await connection.execute(
        'SELECT id FROM settings WHERE setting_key = ? LIMIT 1',
        ['navy_background_color']
      );

      if (existing.length > 0) {
        await connection.execute(
          'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
          [navyBackground, 'navy_background_color']
        );
      } else {
        await connection.execute(
          'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
          ['navy_background_color', navyBackground]
        );
      }
    }

    // Update gold accent color if provided
    if (goldAccent !== undefined) {
      const [existing] = await connection.execute(
        'SELECT id FROM settings WHERE setting_key = ? LIMIT 1',
        ['gold_accent_color']
      );

      if (existing.length > 0) {
        await connection.execute(
          'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
          [goldAccent, 'gold_accent_color']
        );
      } else {
        await connection.execute(
          'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
          ['gold_accent_color', goldAccent]
        );
      }
    }

    // Update paradise text if provided
    if (paradiseText !== undefined) {
      const [existing] = await connection.execute(
        'SELECT id FROM settings WHERE setting_key = ? LIMIT 1',
        ['paradise_text']
      );

      if (existing.length > 0) {
        await connection.execute(
          'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
          [paradiseText, 'paradise_text']
        );
      } else {
        await connection.execute(
          'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
          ['paradise_text', paradiseText]
        );
      }
    }

    // Update paradise background color if provided
    if (paradiseBackgroundColor !== undefined) {
      const [existing] = await connection.execute(
        'SELECT id FROM settings WHERE setting_key = ? LIMIT 1',
        ['paradise_background_color']
      );

      if (existing.length > 0) {
        await connection.execute(
          'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
          [paradiseBackgroundColor, 'paradise_background_color']
        );
      } else {
        await connection.execute(
          'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
          ['paradise_background_color', paradiseBackgroundColor]
        );
      }
    }

    // Update testimonial if provided
    if (testimonial !== undefined) {
      const testimonialJSON = JSON.stringify(testimonial);
      const [existing] = await connection.execute(
        'SELECT id FROM settings WHERE setting_key = ? LIMIT 1',
        ['testimonial_data']
      );

      if (existing.length > 0) {
        await connection.execute(
          'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
          [testimonialJSON, 'testimonial_data']
        );
      } else {
        await connection.execute(
          'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
          ['testimonial_data', testimonialJSON]
        );
      }
    }

    // Update blog posts if provided
    if (blogPosts !== undefined) {
      const blogPostsJSON = JSON.stringify(blogPosts);
      const [existing] = await connection.execute(
        'SELECT id FROM settings WHERE setting_key = ? LIMIT 1',
        ['blog_posts_data']
      );

      if (existing.length > 0) {
        await connection.execute(
          'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
          [blogPostsJSON, 'blog_posts_data']
        );
      } else {
        await connection.execute(
          'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
          ['blog_posts_data', blogPostsJSON]
        );
      }
    }

    // Update paradise animation visibility if provided
    if (showParadiseAnimation !== undefined) {
      const value = showParadiseAnimation ? '1' : '0';
      const [existing] = await connection.execute(
        'SELECT id FROM settings WHERE setting_key = ? LIMIT 1',
        ['show_paradise_animation']
      );

      if (existing.length > 0) {
        await connection.execute(
          'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
          [value, 'show_paradise_animation']
        );
      } else {
        await connection.execute(
          'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
          ['show_paradise_animation', value]
        );
      }
    }

    // Update carousel images visibility if provided
    if (showCarouselImages !== undefined) {
      const value = showCarouselImages ? '1' : '0';
      const [existing] = await connection.execute(
        'SELECT id FROM settings WHERE setting_key = ? LIMIT 1',
        ['show_carousel_images']
      );

      if (existing.length > 0) {
        await connection.execute(
          'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
          [value, 'show_carousel_images']
        );
      } else {
        await connection.execute(
          'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
          ['show_carousel_images', value]
        );
      }
    }

    await connection.end();

    return NextResponse.json({ style, homePageDecoration, banners, brands, navbarColor, darkBackground, navyBackground, goldAccent, paradiseText, paradiseBackgroundColor, testimonial, blogPosts, showParadiseAnimation, showCarouselImages }, { status: 200 });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
