const pool = require("../database/db");

class User {
  constructor(id, name, email, password, role, status_karyawan, atasan_langsung, contract_end_date) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.status_karyawan = status_karyawan;
    this.atasan_langsung = atasan_langsung;
    this.contract_end_date = contract_end_date;
  }

  static async getAllUsers(limit, offset, search) {
    try {
      const query = `
        SELECT id, name, email, role, status_karyawan, atasan_langsung, contract_end_date
        FROM users
        WHERE name ILIKE $1 OR email ILIKE $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `;
      const values = [`%${search}%`, limit, offset];
      const { rows } = await pool.query(query, values);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(id) {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
  }

  async save() {
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role, status_karyawan, atasan_langsung, contract_end_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [this.name, this.email, this.password, this.role, this.status_karyawan, this.atasan_langsung, this.contract_end_date]
    );
    return result.rows[0];
  }

  static async updateUser(id, name, email, role, status_karyawan, atasan_langsung, contract_end_date) {
    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2, role = $3, status_karyawan = $4, atasan_langsung = $5, contract_end_date = $6 WHERE id = $7 RETURNING *",
      [name, email, role, status_karyawan, atasan_langsung, contract_end_date, id]
    );
    return result.rows[0];
  }

  static async getUserByEmail(email) {
    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      return result.rows[0]; // Return user data
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(id) {
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
  }
}

module.exports = User;
