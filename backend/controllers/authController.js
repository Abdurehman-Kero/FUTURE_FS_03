const db = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register new staff (admin only function)
const register = async (req, res) => {
  const { name, phone, email, password, role } = req.body;

  // Validation
  if (!name || !phone || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, phone, and password are required",
    });
  }

  try {
    // Check if staff already exists
    const [existing] = await db.query(
      "SELECT id FROM staff WHERE phone = ? OR email = ?",
      [phone, email || ""],
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Staff with this phone or email already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new staff
    const [result] = await db.query(
      "INSERT INTO staff (name, phone, email, password_hash, role) VALUES (?, ?, ?, ?, ?)",
      [name, phone, email || null, hashedPassword, role || "technician"],
    );

    // Get created staff (without password)
    const [newStaff] = await db.query(
      "SELECT id, name, phone, email, role, created_at FROM staff WHERE id = ?",
      [result.insertId],
    );

    res.status(201).json({
      success: true,
      message: "Staff registered successfully",
      data: newStaff[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login
const login = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({
      success: false,
      message: "Phone and password are required",
    });
  }

  try {
    // Get staff by phone
    const [rows] = await db.query("SELECT * FROM staff WHERE phone = ?", [
      phone,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone or password",
      });
    }

    const staff = rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, staff.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone or password",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: staff.id,
        name: staff.name,
        phone: staff.phone,
        role: staff.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    // Remove password from response
    delete staff.password_hash;

    res.json({
      success: true,
      message: "Login successful",
      data: {
        staff: {
          id: staff.id,
          name: staff.name,
          phone: staff.phone,
          email: staff.email,
          role: staff.role,
        },
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, phone, email, role, created_at FROM staff WHERE id = ?",
      [req.user.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Current password and new password are required",
    });
  }

  try {
    // Get staff with password
    const [rows] = await db.query("SELECT * FROM staff WHERE id = ?", [
      req.user.id,
    ]);

    const staff = rows[0];

    // Check current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      staff.password_hash,
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await db.query("UPDATE staff SET password_hash = ? WHERE id = ?", [
      hashedPassword,
      req.user.id,
    ]);

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all staff (admin only)
const getAllStaff = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, phone, email, role, created_at FROM staff ORDER BY created_at DESC",
    );

    res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update staff role (admin only)
const updateStaffRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const validRoles = ["admin", "technician", "sales"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role. Must be admin, technician, or sales",
    });
  }

  try {
    // Check if staff exists
    const [existing] = await db.query("SELECT id FROM staff WHERE id = ?", [
      id,
    ]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    await db.query("UPDATE staff SET role = ? WHERE id = ?", [role, id]);

    // Get updated staff
    const [updated] = await db.query(
      "SELECT id, name, phone, email, role, created_at FROM staff WHERE id = ?",
      [id],
    );

    res.json({
      success: true,
      message: "Staff role updated successfully",
      data: updated[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  changePassword,
  getAllStaff,
  updateStaffRole,
};
