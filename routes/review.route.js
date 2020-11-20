const express = require('express')
const requireLogin = require('../middlewares/auth.middleware')
const requirePermission = require('../middlewares/permission.middleware')
const { getAllTasksOnReview } = require('../controllers/review.controller')

const router = express.Router()

router.get('/', requireLogin, requirePermission, getAllTasksOnReview)

module.exports = router
