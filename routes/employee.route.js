const express = require('express')
const requireLogin = require('../middlewares/auth.middleware')
const { getAllEmployees, createEmployee, getEmployee } = require('../controllers/employee.controller')
const router = express.Router()

// validation middleware
const { runValidation } = require('../middlewares/run-validation.middleware')
// validators
const { employeeRegisterValidator } = require('../validators')

router.get('/', requireLogin, getAllEmployees)
  .get('/:id', requireLogin, getEmployee)

router.post('/create', requireLogin, employeeRegisterValidator, runValidation, createEmployee)

module.exports = router
