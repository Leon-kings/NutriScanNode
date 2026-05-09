// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const { isTokenBlacklisted } = require("../utils/generateToken");

// // Protect routes (verify token)
// exports.protect = async (req, res, next) => {
//   let token;

//   // Get token from header
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   }

//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: "Not authorized, no token",
//     });
//   }

//   // Check blacklist
//   if (isTokenBlacklisted(token)) {
//     return res.status(401).json({
//       success: false,
//       message: "Token is invalid (logged out)",
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id);

//     if (!user || !user.isActive) {
//       return res.status(401).json({
//         success: false,
//         message: "User not found or inactive",
//       });
//     }

//     req.user = user;
//     req.token = token;

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Not authorized, token failed",
//     });
//   }
// };

// // Role-based access
// exports.authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied",
//       });
//     }
//     next();
//   };
// };








const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes (verify token)
exports.protect = async (req, res, next) => {
  let token;

  // Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id);

    // Check user
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found or inactive",
      });
    }

    // REAL LOGOUT CHECK
    // If token stored in DB does not match current token
    // then user is logged out
    if (user.token !== token) {
      return res.status(401).json({
        success: false,
        message: "Session expired, please login again",
      });
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

// Role-based access
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
};