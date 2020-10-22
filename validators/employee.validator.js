const { check } = require('express-validator')

exports.employeeRegisterValidator = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('Пожалуйста, введите имя работника!'),
  check('surname')
    .not()
    .isEmpty()
    .withMessage('Пожалуйста, введите фамилию работника!'),
  check('roles')
    .not()
    .isEmpty()
    .withMessage('Пожалуйста, выберите роль для работника!'),
  check('phone')
    .not()
    .isEmpty()
    .custom((value) => {
      if (!value.match(/^(?=.{10})[0](\d{2})?[\s]?(\d{3})[\s]?(\d{2})[\s]?(\d{2})$/)) {
        throw new Error('Пожалуйста, введите корректный номер телефона!')
      }

      return true
    }),
  check('email')
    .isEmail()
    .withMessage('Введен неверный E-mail'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Пароль должен содержать 6 цифр, символов или более')
]
