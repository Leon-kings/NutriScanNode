const jwt = require("jsonwebtoken");

const blacklist = new Set();

exports.generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

exports.blacklistToken = (token) => {
  blacklist.add(token);
};

exports.isTokenBlacklisted = (token) => {
  return blacklist.has(token);
};