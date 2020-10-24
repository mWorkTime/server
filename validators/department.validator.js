const { check } = require('express-validator')

exports.departmentValidator = [
  check('name_department')
    .not()
    .notEmpty()
    .withMessage('Пожалуйста, введите название отдела!')
]
