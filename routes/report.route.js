const express = require('express')
const requireLogin = require('../middlewares/auth.middleware')
const requirePermission = require('../middlewares/permission.middleware')
const fileMiddleware = require('../middlewares/file.middleware')
const { getAllTasksForReport, getTask, createReport, uploadReportFiles, getUsersByRoleCode, getUserTasks, getTaskReports } = require('../controllers/report.controller')

const router = express.Router()

router.get('/', requireLogin, getAllTasksForReport)
  .get('/users', requireLogin, getUsersByRoleCode)

router.post('/task', requireLogin, getTask)
  .post('/create', requireLogin, createReport)
  .post('/user/tasks', requireLogin, requirePermission, getUserTasks)
  .post('/task/reports', requireLogin, requirePermission, getTaskReports)

router.put('/upload/report/files', requireLogin, fileMiddleware.array('files', 5), uploadReportFiles)

module.exports = router
