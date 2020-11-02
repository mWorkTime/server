const express = require('express')
const router = express.Router()
const requireLogin = require('../middlewares/auth.middleware')
const { getUser, getUserById } = require('../controllers/user.controller')

router.get('/', requireLogin, getUser)
router.get('/edit', requireLogin, getUserById)

module.exports = router
