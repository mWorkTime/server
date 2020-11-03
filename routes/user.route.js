const express = require('express')
const router = express.Router()
const requireLogin = require('../middlewares/auth.middleware')
const { getUser, getUserById, editUserRegular, confirmPassword } = require('../controllers/user.controller')

router.get('/', requireLogin, getUser)
router.get('/edit', requireLogin, getUserById)
  .put('/edit/regular', requireLogin, editUserRegular)

router.post('/confirm/password', requireLogin, confirmPassword)

module.exports = router
