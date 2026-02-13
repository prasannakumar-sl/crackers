import { getConnection } from '../lib/db.js';
import bcrypt from 'bcryptjs';

async function initializeDatabase() {
  try {
    const connection = await getConnection();
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        image VARCHAR(500),
        quantity INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await connection.execute(createTableQuery);
    console.log('✓ Products table created successfully!');

    const createAdminsTableQuery = `
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await connection.execute(createAdminsTableQuery);
    console.log('✓ Admins table created successfully!');

    const createOrdersTableQuery = `
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255),
        address TEXT NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        item_count INT NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await connection.execute(createOrdersTableQuery);
    console.log('✓ Orders table created successfully!');

    const createOrderItemsTableQuery = `
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT,
        product_name VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      )
    `;

    await connection.execute(createOrderItemsTableQuery);
    console.log('✓ Order Items table created successfully!');

    // Check if default admin exists
    const [rows] = await connection.execute('SELECT * FROM admins WHERE username = ?', ['prasanna']);
    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash('pk160011', 10);
      await connection.execute(
        'INSERT INTO admins (username, password) VALUES (?, ?)',
        ['prasanna', hashedPassword]
      );
      console.log('✓ Default admin user created with encryption!');
    } else {
      // For existing user, update to encrypted password if it's still plain text
      const admin = rows[0];
      if (admin.password === 'pk160011') {
        const hashedPassword = await bcrypt.hash('pk160011', 10);
        await connection.execute(
          'UPDATE admins SET password = ? WHERE username = ?',
          [hashedPassword, 'prasanna']
        );
        console.log('✓ Admin password updated with encryption!');
      }
    }

    await connection.end();
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();
