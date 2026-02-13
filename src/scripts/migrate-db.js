import { getConnection } from '../lib/db.js';

async function migrateDatabase() {
  try {
    console.log('\n=== Running Database Migration ===\n');
    
    const connection = await getConnection();
    
    console.log('1. Increasing image field size...');
    await connection.execute('ALTER TABLE products MODIFY image LONGTEXT');
    console.log('✓ Image field size increased to LONGTEXT');
    
    console.log('\n2. Verifying products table structure...');
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
