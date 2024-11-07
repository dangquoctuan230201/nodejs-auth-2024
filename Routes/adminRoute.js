const express = require('express')
const adminMiddleware = require('../Middlewares/adminMiddleware')
const authMiddleware = require('../Middlewares/authMiddleware')

const route = express.Router();

route.get('/',authMiddleware,adminMiddleware, (req, res) => {
  res.json({
    message: 'Hello admin'
  })
})

module.exports = route
