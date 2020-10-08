const express = require('express')
const router = express.Router()
const requireAuth = require('../middlewares/auth.middleware')
const { register, login, logout } = require('../controllers/auth.controller')

// // validation middleware
const { runValidation } = require('../middlewares/run-validation.middleware')
// // validators
const { registerValidator, loginValidator } = require('../validators/auth.validator')

router.post('/register',registerValidator, runValidation, register)
router.post('/login', loginValidator, runValidation, login)
router.post('/logout', requireAuth, logout)

module.exports = router
