const express = require('express')
const requireLogin = require('../middlewares/auth.middleware')
const fileMiddleware = require('../middlewares/file.middleware')
const { getAllTasksForReport, getTask, createReport, uploadReportFiles } = require('../controllers/report.controller')

const router = express.Router()

router.get('/', requireLogin, getAllTasksForReport)

router.post('/task', requireLogin, getTask)
  .post('/create', requireLogin, createReport)
  .put('/upload/report/files', requireLogin, fileMiddleware.array('files', 5), uploadReportFiles)

module.exports = router
