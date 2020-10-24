const express = require('express')
const requireLogin = require('../middlewares/auth.middleware')
const { getRoles } = require('../controllers/role.controller')

const router = express.Router()

router.get('/', requireLogin, getRoles)

module.exports = router
