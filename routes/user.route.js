const express = require('express')
const router = express.Router()
const requireLogin = require('../middlewares/auth.middleware')
const { getUser } = require('../controllers/user.controller')

router.get('/', requireLogin, getUser)

module.exports = router
