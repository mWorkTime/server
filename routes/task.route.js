const express = require('express')
const router = express.Router()
const requireLogin = require('../middlewares/auth.middleware')
const { getEmployeesAndTasks } = require('../controllers/task.controller')

router.get('/', requireLogin, getEmployeesAndTasks)

module.exports = router
