// Conexión opcional a PostgreSQL (hoy no la usa ninguna capa; se conserva por compatibilidad)
function connectPostgres() {
  let pool = null;
  let usePostgres = false;

  if (process.env.DATABASE_URL || (process.env.PGHOST && process.env.PGUSER)) {
    try {
      const { Pool } = require('pg');
      pool = new Pool({
        connectionString: process.env.DATABASE_URL || `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE}`
      });
      usePostgres = true;
      console.log('Connected to PostgreSQL Database.');
    } catch (err) {
      console.warn('PostgreSQL connection error, falling back to In-Memory/Dev storage:', err.message);
    }
  } else {
    console.log('Running backend in Dev mode with local dataset (PostgreSQL optional via env).');
  }
  return { pool, usePostgres };
}

module.exports = { connectPostgres };
