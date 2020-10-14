const express = require('express')
const router = express.Router()

const { confirmEmail, resendLink } = require('../controllers/confirm.controller')
const { resendLinkValidator } = require('../validators/resend-link.validator')
const { runValidation } = require('../middlewares/run-validation.middleware')

router.post('/email', confirmEmail)
  .post('/resend/link', resendLinkValidator, runValidation, resendLink)

module.exports = router
