const bcrypt = require('bcryptjs');

/**
 * Seed file to create an initial admin user
 */
exports.seed = async function(knex) {
  // Check if users table is empty
  const userCount = await knex('users').count('id as count').first();
  
  if (parseInt(userCount.count) === 0) {
    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    return knex('users').insert([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        department: 'Administration',
        position: 'System Administrator',
        active: true
      }
    ]);
  }
};