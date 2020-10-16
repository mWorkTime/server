const express = require('express')
const router = express.Router()
const requireLogin = require('../middlewares/auth.middleware')
const { register, login, logout } = require('../controllers/auth.controller')

// // validation middleware
const { runValidation } = require('../middlewares/run-validation.middleware')
// // validators
const { registerValidator, loginValidator } = require('../validators/auth.validator')

router.post('/register', registerValidator, runValidation, register)
  .post('/login', loginValidator, runValidation, login)
  .post('/logout', requireLogin, logout)

module.exports = router
