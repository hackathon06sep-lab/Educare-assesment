require('dotenv').config();

const mysql = require('mysql2/promise');

function parseConnectionUrl(connectionUrl) {
  let url;

  try {
    url = new URL(connectionUrl);
  } catch (_error) {
    throw new Error(
      'Invalid MySQL connection URL. Check MYSQL_PUBLIC_URL, MYSQL_URL, or DATABASE_URL in your environment variables.'
    );
  }

  if (!url.hostname || !url.username || !url.pathname.replace(/^\//, '')) {
    throw new Error(
      'Incomplete MySQL connection URL. It must include user, password, host, port, and database name.'
    );
  }

  return {
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.replace(/^\//, ''))
  };
}

function getDatabaseConfig() {
  const connectionUrl =
    process.env.MYSQL_PUBLIC_URL ||
    process.env.MYSQL_URL ||
    process.env.DATABASE_URL;

  if (connectionUrl && connectionUrl.startsWith('mysql')) {
    return parseConnectionUrl(connectionUrl);
  }

  return {
    host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
    port: Number(process.env.DB_PORT || process.env.MYSQLPORT) || 3306,
    user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
    database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'school_management'
  };
}

const pool = mysql.createPool({
  ...getDatabaseConfig(),
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0
});

pool.ensureDatabaseReady = async function ensureDatabaseReady() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS schools (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(500) NOT NULL,
      latitude FLOAT NOT NULL,
      longitude FLOAT NOT NULL
    )
  `);
};

module.exports = pool;
