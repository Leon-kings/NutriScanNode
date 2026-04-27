const express = require("express");
const router = express.Router();
const authontication = require("../controllers/authController");

// PUBLIC
router.post("/register", authontication.register);
router.post("/login", authontication.login);
router.get('/users',authontication.getAllUsers);
// PROTECTED
router.get("/me", authontication.getMe);
router.post("/logout", authontication.logout);
router.put("/change-password", authontication.changePassword);


module.exports = router;