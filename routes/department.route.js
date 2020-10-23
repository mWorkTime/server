const express = require('express')
const requireLogin = require('../middlewares/auth.middleware')
const { getAllDepartments, createDepartment } = require('../controllers/department.controller')
const router = express.Router()

router.get('/', requireLogin, getAllDepartments)
router.post('/create', requireLogin, createDepartment)

module.exports = router
