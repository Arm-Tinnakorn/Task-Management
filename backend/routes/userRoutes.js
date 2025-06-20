const express = require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const { getUsers, getUserById, deleteUser, updateProfileAvatar } = require("../controller/userController");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

//User Management Routes
router.get("/", protect, adminOnly, getUsers); //Get all users (Admin only)
router.get("/:id", protect, getUserById); //Get a specific user

// Route ใหม่สำหรับอัปเดตรูปโปรไฟล์
router.post('/update-avatar', protect, upload.single('image'), updateProfileAvatar); // Field name 'image' ต้องตรงกับ formData.append("image", imageFile) ใน Frontend
module.exports = router;