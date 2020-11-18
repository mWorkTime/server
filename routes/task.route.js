const express = require('express')
const router = express.Router()
const requireLogin = require('../middlewares/auth.middleware')
const requirePermission = require('../middlewares/permission.middleware')
const fileMiddleware = require('../middlewares/file.middleware')

const { getEmployeesAndTasks, getEmployeesByDepartment, uploadFile, createTask, downloadFiles, updateTaskStatus, putTaskOnReview } = require('../controllers/task.controller')

router.get('/', requireLogin, getEmployeesAndTasks)
  .get('/:id/files/download', downloadFiles)

router.post('/employees', requireLogin, getEmployeesByDepartment)
  .post('/create', requireLogin, requirePermission, createTask)

router.put('/upload', requireLogin, fileMiddleware.array('files', 4), uploadFile)
  .put('/update/status', requireLogin, updateTaskStatus)
  .put('/send/review', requireLogin, putTaskOnReview)

module.exports = router
