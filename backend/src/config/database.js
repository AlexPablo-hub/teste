const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cadastro_veiculos',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conectado ao Banco de Dados!');
    connection.release();
  } catch (error) {
    console.error('Erro ao conectar com o Banco de Dados:', error.message);
    process.exit(1);
  }
};

module.exports = {
  pool,
  testConnection
};