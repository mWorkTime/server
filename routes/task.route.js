const express = require('express')
const router = express.Router()
const requireLogin = require('../middlewares/auth.middleware')
const { getEmployeesAndTasks, getEmployeesByDepartment } = require('../controllers/task.controller')

router.get('/', requireLogin, getEmployeesAndTasks)

router.post('/employees', requireLogin, getEmployeesByDepartment)

module.exports = router
