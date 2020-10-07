const express = require('express')
const router = express.Router()
const { register, login } = require('../controllers/auth.controller')

// // validation middleware
const { runValidation } = require('../middlewares/run-validation.middleware')
// // validators
const { registerValidator, loginValidator } = require('../validators/auth.validator')

router.post('/register',registerValidator, runValidation, register)
router.post('/login', loginValidator, runValidation, login)


module.exports = router
