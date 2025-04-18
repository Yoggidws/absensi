const express = require("express");
const userController = require("../controllers/UserController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

console.log("UserController:", userController);

const router = express.Router();
router.get("/", verifyToken, userController.getAllUsers);
router.get("/:id", verifyToken, userController.getUserById);
router.post("/", verifyToken, isAdmin, userController.createUser);
router.put("/:id", verifyToken, isAdmin, userController.updateUser);
router.delete("/:id", verifyToken, isAdmin, userController.deleteUser);


module.exports = router;
