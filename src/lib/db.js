import mysql from 'mysql2/promise';

export async function getConnection() {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'pk_crackers',
    password: 'pk_crackers',
    database: 'pk_crackers',
  });
}
