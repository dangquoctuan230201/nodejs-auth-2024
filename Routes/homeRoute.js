const express = require('express');
const authMiddleware = require('../Middlewares/authMiddleware')

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  const { username, userId, role } = req.userInfo;

  res.json({
    message: 'Welcome',
    user: {
      _id: userId,
      username,
      role
    }
  })
})


module.exports = router
