const express = require('express')
const router = express.Router()
const requireLogin = require('../middlewares/auth.middleware')
const { getUser, getUserById, editUserRegular } = require('../controllers/user.controller')

router.get('/', requireLogin, getUser)
router.get('/edit', requireLogin, getUserById)
  .put('/edit/regular', requireLogin, editUserRegular)

module.exports = router
