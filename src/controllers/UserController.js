const bcrypt = require("bcrypt");
const User = require("../models/User");
const db = require("../database/db");

async function generateUserId() {
  // Ambil 2 digit terakhir tahun sekarang
  const yearPart = new Date().getFullYear().toString().slice(-2);

  // Ambil angka terakhir dari user_id yang ada
  const result = await db.query(`
    SELECT id FROM users WHERE id::TEXT LIKE '${yearPart}%' ORDER BY id DESC LIMIT 1
  `);

  let newId;
  if (result.rows.length === 0) {
    newId = `${yearPart}0000001`; // Jika belum ada, mulai dari 1
  } else {
    newId = (parseInt(result.rows[0].id) + 1).toString(); // Jika sudah ada, lanjut increment
  }

  return newId;
}


exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    const users = await User.getAllUsers(limit, offset, search);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.createUser = async (req, res) => {
//   try {
//     const { name, email, password, role, status_karyawan, atasan_langsung, contract_end_date } = req.body;

//     // console.log("Password received:", password); // Cek apakah password ada

//     if (!password) {
//       return res.status(400).json({ error: "Password is required" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User(null, name, email, hashedPassword, role, status_karyawan, atasan_langsung, contract_end_date);
//     const savedUser = await newUser.save();
//     res.status(201).json(savedUser);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, status_karyawan, atasan_langsung, contract_end_date } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await generateUserId(); // 🔹 Generate ID berdasarkan tahun

    const newUser = new User(userId, name, email, hashedPassword, role, status_karyawan, atasan_langsung, contract_end_date);
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, status_karyawan, atasan_langsung, contract_end_date } = req.body;
    const updatedUser = await User.updateUser(req.params.id, name, email, role, status_karyawan, atasan_langsung, contract_end_date);
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.deleteUser(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
