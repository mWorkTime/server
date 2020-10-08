const express = require('express')
const router = express.Router()

const { confirmEmail } = require('../controllers/confirm.controller')

router.post('/email', confirmEmail)

module.exports = router
