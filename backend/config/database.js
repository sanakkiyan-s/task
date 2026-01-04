const { Sequelize } = require('sequelize');
require('dotenv').config();


console.log('=== Database Configuration Debug ===');
console.log('SUPABASE_URL exists:', !!process.env.SUPABASE_URL);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('=============================');

let sequelize;

// If SUPABASE_URL is provided, use it
if (process.env.SUPABASE_URL) {
  console.log('🔗 Using Supabase connection');

  // Parse the Supabase URL
  const supabaseUrl = process.env.SUPABASE_URL;
  console.log('Supabase URL (masked):', supabaseUrl.replace(/:[^:@]+@/, ':****@'));

  sequelize = new Sequelize(supabaseUrl, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      // Force IPv4 for Render compatibility
      family: 4,
      // Disable prepared statements (required for Supabase Transaction Pooler)
      prepare: false,
    },
    logging: console.log, // Enable logging for debugging
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
}
// Otherwise, use individual environment variables
else {
  console.log('🏠 Using local PostgreSQL connection');
  sequelize = new Sequelize(
    process.env.DB_NAME || 'task_manager',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '', // Can be empty string for no password
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: console.log,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

module.exports = sequelize;