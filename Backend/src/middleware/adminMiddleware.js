












const jwt = require("jsonwebtoken");
const User = require("../models/user");
const tokenBlocklist = require("../utils/tokenBlocklist");

const adminMiddleware = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const payload = jwt.verify(token, process.env.JWT_KEY);

    if (!payload?._id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await User.findById(payload._id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isBlocked = await tokenBlocklist.isBlocked(token);
    if (isBlocked) {
      return res.status(401).json({ message: "Token is blocked" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.result = user;

    next();
  } catch (error) {
    console.error("Admin Middleware Error:", error.message);
    return res.status(401).json({ message: "Unauthorized access" });
  }
};

module.exports = adminMiddleware;
