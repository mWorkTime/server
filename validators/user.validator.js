const { check } = require('express-validator')

exports.passwordValidator = [
  check('password')
    .isLength({ min: 6 })
    .withMessage('Пароль должен содержать 6 цифр, символов или более')
]
