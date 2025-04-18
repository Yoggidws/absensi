// /**
//  * Initial database schema migration
//  */
// exports.up = function(knex) {
//     return knex.schema
//       // Users table
//       .createTable('users', function(table) {
//         table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
//         table.string('name').notNullable();
//         table.string('email').notNullable().unique();
//         table.string('password').notNullable();
//         table.enum('role', ['admin', 'employee']).defaultTo('employee');
//         table.string('department').nullable();
//         table.string('position').nullable();
//         table.string('avatar').nullable();
//         table.boolean('active').defaultTo(true);
//         table.string('reset_password_token').nullable();
//         table.timestamp('reset_password_expire').nullable();
//         table.timestamps(true, true);
//       })
      
//       // Attendance table
//       .createTable('attendance', function(table) {
//         table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
//         table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
//         table.enum('type', ['check-in', 'check-out']).notNullable();
//         table.timestamp('timestamp').notNullable().defaultTo(knex.fn.now());
//         table.string('qr_id').notNullable();
//         table.jsonb('location').nullable();
//         table.string('ip_address').nullable();
//         table.string('device_info').nullable();
//         table.enum('status', ['valid', 'suspicious', 'invalid']).defaultTo('valid');
//         table.text('notes').nullable();
//         table.timestamps(true, true);
        
//         // Add indexes for efficient queries
//         table.index(['user_id', 'timestamp']);
//         table.index('qr_id');
//         table.index('timestamp');
//       })
      
//       // Reports table
//       .createTable('reports', function(table) {
//         table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
//         table.string('name').notNullable();
//         table.enum('type', ['daily', 'weekly', 'monthly', 'custom']).notNullable();
//         table.enum('format', ['pdf', 'excel', 'csv']).defaultTo('pdf');
//         table.jsonb('date_range').notNullable();
//         table.jsonb('filters').nullable();
//         table.uuid('created_by').notNullable().references('id').inTable('users').onDelete('CASCADE');
//         table.string('file_url').nullable();
//         table.boolean('is_scheduled').defaultTo(false);
//         table.jsonb('schedule').nullable();
//         table.timestamps(true, true);
//       });
//   };
  
//   exports.down = function(knex) {
//     return knex.schema
//       .dropTableIfExists('reports')
//       .dropTableIfExists('attendance')
//       .dropTableIfExists('users');
//   };


// migration filename: 20250417100000_create_hr_system_schema.js

// migration filename: 20250417101010_create_hr_schema_best_practice.js

exports.up = async function(knex) {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'); // enable UUID
  
    await knex.schema
      .createTable('User', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('email', 255).notNullable().unique();
        table.string('password', 255).notNullable();
        table.string('name', 100).notNullable();
        table.string('role', 50).notNullable().defaultTo('EMPLOYEE');
        table.string('department', 100);
        table.string('position', 100);
        table.timestamp('joinDate', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.string('avatar');
        table.timestamp('createdAt', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('updatedAt', { useTz: true }).notNullable().defaultTo(knex.fn.now());
      })
  
      .createTable('Department', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('name', 100).notNullable().unique();
        table.text('description');
        table.timestamp('createdAt', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('updatedAt', { useTz: true }).notNullable().defaultTo(knex.fn.now());
      })
  
      .createTable('Position', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('title', 100).notNullable();
        table.string('department', 100).notNullable();
        table.string('level', 50).notNullable();
        table.timestamp('createdAt', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('updatedAt', { useTz: true }).notNullable().defaultTo(knex.fn.now());
      })
  
      .createTable('AttendanceRecord', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid('userId').notNullable();
        table.date('date').notNullable();
        table.timestamp('checkIn', { useTz: true }).notNullable();
        table.timestamp('checkOut', { useTz: true });
        table.string('status', 50).notNullable().defaultTo('Present');
        table.timestamp('createdAt', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('updatedAt', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  
        table.foreign('userId').references('User.id').onDelete('RESTRICT').onUpdate('CASCADE');
        table.index(['userId'], 'AttendanceRecord_userId_idx');
        table.index(['date'], 'AttendanceRecord_date_idx');
      })
  
      .createTable('LeaveRequest', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid('userId').notNullable();
        table.string('type', 50).notNullable();
        table.date('startDate').notNullable();
        table.date('endDate').notNullable();
        table.text('reason').notNullable();
        table.string('status', 50).notNullable().defaultTo('PENDING');
        table.timestamp('createdAt', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('updatedAt', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  
        table.foreign('userId').references('User.id').onDelete('RESTRICT').onUpdate('CASCADE');
        table.index(['userId'], 'LeaveRequest_userId_idx');
      })
  
      .createTable('Document', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid('userId').notNullable();
        table.string('name', 100).notNullable();
        table.string('type', 50).notNullable();
        table.text('url').notNullable();
        table.text('description');
        table.timestamp('createdAt', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('updatedAt', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  
        table.foreign('userId').references('User.id').onDelete('RESTRICT').onUpdate('CASCADE');
        table.index(['userId'], 'Document_userId_idx');
      })
  
      .createTable('SalaryInformation', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid('userId').notNullable().unique();
        table.decimal('baseSalary', 12, 2).notNullable(); // Accurate for money
        table.string('currency', 10).notNullable().defaultTo('USD');
        table.date('effectiveDate').notNullable().defaultTo(knex.fn.now());
        table.timestamp('createdAt', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('updatedAt', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  
        table.foreign('userId').references('User.id').onDelete('RESTRICT').onUpdate('CASCADE');
      })
  
      .createTable('PayrollRun', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('period', 20).notNullable(); // e.g., "2025-04"
        table.timestamp('runDate', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.string('status', 50).notNullable().defaultTo('Pending');
        table.integer('employees').notNullable();
        table.decimal('totalAmount', 14, 2).notNullable();
        table.timestamp('createdAt', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('updatedAt', { useTz: true }).notNullable().defaultTo(knex.fn.now());
      });
  };
  
  exports.down = async function(knex) {
    await knex.schema
      .dropTableIfExists('PayrollRun')
      .dropTableIfExists('SalaryInformation')
      .dropTableIfExists('Document')
      .dropTableIfExists('LeaveRequest')
      .dropTableIfExists('AttendanceRecord')
      .dropTableIfExists('Position')
      .dropTableIfExists('Department')
      .dropTableIfExists('User');
  };
  