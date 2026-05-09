require('dotenv').config();

const app = require('./app');
const pool = require('./config/db');

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  await pool.ensureDatabaseReady();

  app.listen(PORT, () => {
    console.log(`School Management API listening on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to initialize database connection', error);
  process.exit(1);
});
