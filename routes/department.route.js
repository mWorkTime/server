const express = require('express')
const { getAllDepartments, createDepartment } = require('../controllers/department.controller')
const requirePermission = require('../middlewares/permission.middleware')
const router = express.Router()

// middlewares
const { runValidation } = require('../middlewares/run-validation.middleware')
const requireLogin = require('../middlewares/auth.middleware')

// Validators
const { departmentValidator } = require('../validators/department.validator')

router.get('/', requireLogin, getAllDepartments)
router.post('/create', requireLogin, requirePermission, departmentValidator, runValidation, createDepartment)

module.exports = router
