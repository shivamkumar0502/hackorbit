// const jwt = require("jsonwebtoken");
// const User = require("../models/user");
// const redisClient = require("../config/redis");

// const adminMiddleware = async (req, res, next) => {
//   try {
//     // 🔹 Get token from cookie OR Authorization header
//     const token =
//       req.cookies?.token ||
//       (req.headers.authorization &&
//         req.headers.authorization.startsWith("Bearer ")
//         ? req.headers.authorization.split(" ")[1]
//         : null);

//     if (!token) {
//       return res.status(401).send("Token is not present");
//     }

//     // 🔹 Verify JWT
//     const payload = jwt.verify(token, process.env.JWT_KEY);

//     if (!payload || !payload._id) {
//       return res.status(401).send("Invalid token");
//     }

//     // 🔹 Check user in DB
//     const user = await User.findById(payload._id);
//     if (!user) {
//       return res.status(401).send("User does not exist");
//     }

//     // 🔹 Role check
//     if (user.role !== "admin") {
//       return res.status(403).send("Admin access required");
//     }

//     // 🔹 Check Redis blocklist
//     const isBlocked = await redisClient.exists(`token:${token}`);
//     if (isBlocked) {
//       return res.status(401).send("Token is blocked");
//     }

//     // Attach user to request
//     req.result = user;

//     next();
//   } catch (err) {
//     res.status(401).send("Error: " + err.message);
//   }
// };

// module.exports = adminMiddleware;



const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis");

const adminMiddleware = async (req, res, next) => {
  try {
    // 🔹 Get token from cookie OR Authorization header
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

    // 🔹 Verify JWT
    const payload = jwt.verify(token, process.env.JWT_KEY);

    if (!payload?._id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // 🔹 Check if user exists
    const user = await User.findById(payload._id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 🔹 Check if token is blocked in Redis
    const isBlocked = await redisClient.exists(`token:${token}`);
    if (isBlocked) {
      return res.status(401).json({ message: "Token is blocked" });
    }

    // 🔹 Role check
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    // Attach user to request
    req.result = user;

    next();
  } catch (error) {
    console.error("Admin Middleware Error:", error.message);
    return res.status(401).json({ message: "Unauthorized access" });
  }
};

module.exports = adminMiddleware;