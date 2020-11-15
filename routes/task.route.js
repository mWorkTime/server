const express = require('express')
const router = express.Router()
const requireLogin = require('../middlewares/auth.middleware')
const requirePermission = require('../middlewares/permission.middleware')
const fileMiddleware = require('../middlewares/file')

const { getEmployeesAndTasks, getEmployeesByDepartment, uploadFile, createTask } = require('../controllers/task.controller')

router.get('/', requireLogin, getEmployeesAndTasks)

router.post('/employees', requireLogin, getEmployeesByDepartment)
  .post('/create', requireLogin, requirePermission, createTask)

router.put('/upload', requireLogin, fileMiddleware.array('files', 4), uploadFile)

module.exports = router
