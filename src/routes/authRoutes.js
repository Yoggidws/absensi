const express = require("express");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const userController = require("../controllers/UserController");

const router = express.Router();

router.get("/", verifyToken, isAdmin, userController.getAllUsers); // Hanya admin bisa akses

module.exports = router;
