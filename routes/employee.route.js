const express = require('express')
const requireLogin = require('../middlewares/auth.middleware')
const requireSameOrganization = require('../middlewares/organization.middleware')
const requirePermission = require('../middlewares/permission.middleware')
const { getAllEmployees, createEmployee, getEmployee, editEmployee, dismissEmployee, recoverEmployee } = require('../controllers/employee.controller')
const router = express.Router()

// validation middleware
const { runValidation } = require('../middlewares/run-validation.middleware')
// validators
const { employeeRegisterValidator } = require('../validators')

router.get('/', requireLogin, getAllEmployees)
  .get('/:id', requireLogin, getEmployee)

router.post('/create', requireLogin, requirePermission, employeeRegisterValidator, runValidation, createEmployee)

router.put('/edit', requireLogin, requireSameOrganization, requirePermission, editEmployee)
  .put('/dismiss', requireLogin, requireSameOrganization, requirePermission, dismissEmployee)
  .put('/recover', requireLogin, requireSameOrganization, requirePermission, recoverEmployee)

module.exports = router
