const jwt = require("jsonwebtoken");

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

// Check if user is technician or admin
const isTechnician = (req, res, next) => {
  if (req.user.role !== "technician" && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Technician privileges required.",
    });
  }
  next();
};

// Check if user is sales staff or admin
const isSalesStaff = (req, res, next) => {
  if (req.user.role !== "sales" && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Sales staff privileges required.",
    });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  isTechnician,
  isSalesStaff,
};
