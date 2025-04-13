const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();
const ADMIN_SECRET = "your_admin_secret"; // Ideally use process.env.ADMIN_SECRET

// ✅ Admin Registration (for creating admin users)
router.post("/register", [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("name").notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
        let existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Admin already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new User({
            name,
            email,
            password: hashedPassword,
            isAdmin: true // 👈 mark as admin
        });

        await newAdmin.save();
        res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering admin", error });
    }
});

// ✅ Admin Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await User.findOne({ email });
        if (!admin || !admin.isAdmin) {
            return res.status(400).json({ message: "Invalid admin credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid admin credentials" });
        }

        const token = jwt.sign(
            { userId: admin._id, isAdmin: true },
            ADMIN_SECRET,
            { expiresIn: "2h" }
        );

        res.json({ token, message: "Admin login successful" });
    } catch (error) {
        res.status(500).json({ message: "Error logging in as admin", error });
    }
});

// ✅ Middleware for protecting admin routes
function authenticateAdmin(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token, ADMIN_SECRET);
        if (!decoded.isAdmin) throw new Error();
        req.admin = decoded;
        next();
    } catch {
        res.status(403).json({ error: "Unauthorized" });
    }
}

module.exports = {
    router,
    authenticateAdmin
};
