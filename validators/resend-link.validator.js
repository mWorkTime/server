const { check } = require('express-validator')

exports.resendLinkValidator =  [
  check('email')
    .isEmail()
    .withMessage('Введен неверный E-mail'),
]
