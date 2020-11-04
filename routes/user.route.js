const express = require('express')
const router = express.Router()
const requireLogin = require('../middlewares/auth.middleware')
const { getUser, getUserById, editUserRegular, confirmPassword, editPassword } = require('../controllers/user.controller')
const { passwordValidator } = require('../validators')
const { runValidation } = require('../middlewares/run-validation.middleware')

router.get('/', requireLogin, getUser)
router.get('/edit', requireLogin, getUserById)
  .put('/edit/regular', requireLogin, editUserRegular)
  .put('/edit/password', requireLogin, passwordValidator, runValidation, editPassword)

router.post('/confirm/password', requireLogin, confirmPassword)

module.exports = router
