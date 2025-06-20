const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

//@desc Get all users (Admin only)
//@route GET /api/users/
//@access Private (Admin)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role:"user"}).select("-password");

        //Add task counts to each user
        const usersWithTaskCounts = await Promise.all(
            users.map(async (user) => {
                const pendingTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "Pending",
                });
                const inProgressTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "In Progress",
                });
                const completedTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "Completed",
                });
        
                return {
                    ...user._doc, //Include all existing user data
                    pendingTasks,
                    inProgressTasks,
                    completedTasks,
                };
            }));

            res.json(usersWithTaskCounts);
    }catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    } 
};

//@desc Get user by ID
//@route GET /api/users/:id
//@access Private
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found"});
        res.json(user);
    }catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    } 
};

//@desc Update user profile avatar
//@route POST /api/users/update-avatar
//@access Private
const updateProfileAvatar = async (req, res) => {
    try {
        // 1. ตรวจสอบว่ามีไฟล์อัปโหลดมาหรือไม่ (Multer จะจัดการและใส่ข้อมูลไฟล์ไว้ใน req.file)
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded.' });
        }

        // 2. ตรวจสอบการยืนยันตัวตนของผู้ใช้
        // **สำคัญมาก:** req.user มาจาก Authentication Middleware (เช่น JWT).
        // คุณต้องแน่ใจว่า middleware นั้นถูกเรียกใช้ก่อน controller นี้ใน route
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Unauthorized: User not identified.' });
        }

        const userId = req.user._id; // ดึง User ID ของผู้ใช้ที่ล็อกอินอยู่

        // 3. สร้าง URL ของรูปภาพที่ถูกบันทึก
        // ตรวจสอบ BASE_URL ใน Frontend และ Backend ให้ตรงกัน
        // และต้องมี '/' ระหว่าง BASE_URL กับ 'uploads'
        // แนะนำให้ดึง BASE_URL จาก environment variables (process.env.BASE_URL)
        const baseUrl = process.env.BASE_URL || 'http://localhost:8000'; // ควรตั้งค่าใน .env
        const profileImageUrl = `${baseUrl}/uploads/${req.file.filename}`;

        // 4. อัปเดตฟิลด์ profileImageUrl ของผู้ใช้ในฐานข้อมูล
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profileImageUrl: profileImageUrl },
            { new: true, runValidators: true } // new: true คืนค่าเอกสารที่อัปเดตแล้ว, runValidators: true ตรวจสอบ validation
        );

        // 5. ตรวจสอบว่าการอัปเดตสำเร็จหรือไม่
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found or update failed.' });
        }

        // 6. ส่ง Response กลับไปให้ Frontend พร้อม URL รูปภาพใหม่
        res.status(200).json({
            message: 'Profile picture updated successfully!',
            profileImageUrl: updatedUser.profileImageUrl
        });

    } catch (error) {
        console.error('Error during profile image upload and update:', error);
        // การจัดการ Error ที่มาจาก Multer หรือ Error อื่นๆ
        if (error.message.includes('Only .jpeg, .jpg and .png formats are allowed')) {
            return res.status(400).json({ message: 'Invalid file format. Only JPEG, JPG, and PNG are allowed.' });
        }
        res.status(500).json({ message: 'Failed to update profile picture due to a server error.', error: error.message });
    }
};


module.exports = { getUsers, getUserById, updateProfileAvatar};