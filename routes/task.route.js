const express = require('express')
const router = express.Router()
const requireLogin = require('../middlewares/auth.middleware')
const { getEmployeeAndTasks } = require('../controllers/task.controller')

router.get('/', requireLogin, getEmployeeAndTasks)

module.exports = router
