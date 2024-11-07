const express = require('express');
const { registerUser, loginUser, changePassword } = require('../Controllers/authController');
const authMiddleware = require("../Middlewares/authMiddleware");


const router = express.Router();

router.post("/register", registerUser),
router.post("/login", loginUser),
router.patch("/change-password",authMiddleware, changePassword);



module.exports = router;
