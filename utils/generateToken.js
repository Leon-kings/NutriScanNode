const jwt = require("jsonwebtoken");

/**
 * Generate JWT token
 */
exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

/**
 * Fake blacklist function
 * Keeps old controllers compatible
 */
exports.blacklistToken = async () => {
  return true;
};

/**
 * Always return false
 * since blacklist system is removed
 */
exports.isTokenBlacklisted = async () => {
  return false;
};