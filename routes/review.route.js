const express = require('express')
const requireLogin = require('../middlewares/auth.middleware')
const requirePermission = require('../middlewares/permission.middleware')
const { getAllTasksOnReview, confirmReviewTask } = require('../controllers/review.controller')

const router = express.Router()

router.get('/', requireLogin, requirePermission, getAllTasksOnReview)

router.put('/confirm/success', requireLogin, requirePermission, confirmReviewTask)

module.exports = router