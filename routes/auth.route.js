const express = require('express')
const router = express.Router()
const { register  } = require('../controllers/auth.controller')

// // validation middleware
const { runValidation } = require('../middlewares/run-validation.middleware')
// // validators
const { registerValidator } = require('../validators/auth.validator')

router.post('/register',registerValidator, runValidation, register)


module.exports = router
