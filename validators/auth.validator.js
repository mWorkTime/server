const { check } = require('express-validator')

exports.registerValidator = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('Пожалуйста, введите ваше имя!'),
  check('organization')
    .not()
    .isEmpty()
    .withMessage('Пожалуйста, введите название организации!'),
  check('email')
    .isEmail()
    .withMessage('Введен неверный E-mail'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Пароль должен содержать 6 цифр, символов или более')
]
