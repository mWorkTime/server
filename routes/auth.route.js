const express = require('express')
const router = express.Router()
const requireLogin = require('../middlewares/auth.middleware')
const { register, login, logout, refreshToken } = require('../controllers/auth.controller')

// validation middleware
const { runValidation } = require('../middlewares/run-validation.middleware')
// validators
const { registerValidator, loginValidator } = require('../validators')

router.post('/register', registerValidator, runValidation, register)
  .post('/login', loginValidator, runValidation, login)
  .post('/logout', requireLogin, logout)
  .post('/refresh', refreshToken)

module.exports = router
