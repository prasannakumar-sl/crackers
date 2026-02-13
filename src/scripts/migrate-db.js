import { getConnection } from '../lib/db.js';

async function migrateDatabase() {
  try {
    console.log('\n=== Running Database Migration ===\n');

    const connection = await getConnection();

    console.log('1. Increasing image field size...');
    await connection.execute('ALTER TABLE products MODIFY image LONGTEXT');
    console.log('✓ Image field size increased to LONGTEXT');

    console.log('\n2. Creating product_sections table...');
    const createSectionsTableQuery = `
      CREATE TABLE IF NOT EXISTS product_sections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await connection.execute(createSectionsTableQuery);
    console.log('✓ Product sections table created');

    console.log('\n3. Creating section_products table...');
    const createSectionProductsTableQuery = `
      CREATE TABLE IF NOT EXISTS section_products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        section_id INT NOT NULL,
        product_id INT NOT NULL,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (section_id) REFERENCES product_sections(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_section_product (section_id, product_id)
      )
    `;
    await connection.execute(createSectionProductsTableQuery);
    console.log('✓ Section products table created');

    console.log('\n4. Verifying products table structure...');
    const [tableInfo] = await connection.execute('DESCRIBE products');
    console.log('✓ Products table structure:');
    tableInfo.forEach(col => {
      if (col.Field === 'image') {
        console.log(`  - ${col.Field} (${col.Type}) ← Updated!`);
      } else {
        console.log(`  - ${col.Field} (${col.Type})`);
      }
    });

    await connection.end();
    console.log('\n✓ Migration completed successfully!\n');

  } catch (error) {
    console.error('\n✗ Migration failed:');
    console.error(error.message);
    process.exit(1);
  }
}

migrateDatabase();
