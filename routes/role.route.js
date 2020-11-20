const express = require('express')
const requireLogin = require('../middlewares/auth.middleware')
const { getRoles, getUserRole } = require('../controllers/role.controller')

const router = express.Router()

router.get('/', requireLogin, getRoles)
  .get('/:id', requireLogin, getUserRole)

module.exports = router
