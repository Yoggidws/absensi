const knex = require('knex');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'attendance_system',
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: path.join(__dirname, 'migrations') // Use absolute path
  }
});

// Run migrations
const migrate = async () => {
  try {
    console.log('Running migrations...');
    await db.migrate.latest();
    console.log('Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();