const knex = require('knex');
const path = require('path');

// Initialize knex with PostgreSQL configuration
const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'yoggi',
    database: process.env.DB_NAME || 'attendance_system',
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: path.join(__dirname, '../db/migrations')
  },
  seeds: {
    directory: path.join(__dirname, '../db/seeds')
  }
});

// Test database connection
const testConnection = async () => {
  try {
    await db.raw('SELECT 1');
    console.log('PostgreSQL Connected');
    return true;
  } catch (error) {
    console.error(`Error connecting to PostgreSQL: ${error.message}`);
    return false;
  }
};

module.exports = { db, testConnection };