const express = require('express')
const requireLogin = require('../middlewares/auth.middleware')
const requirePermission = require('../middlewares/permission.middleware')
const fileMiddleware = require('../middlewares/file.middleware')
const { getAllTasksOnReview, confirmReviewTask, reviewComment, reviewCommentFiles } = require('../controllers/review.controller')

const router = express.Router()

router.get('/', requireLogin, requirePermission, getAllTasksOnReview)

router.put('/confirm/success', requireLogin, requirePermission, confirmReviewTask)
  .put('/comment/create', requireLogin, requirePermission, reviewComment)
  .put('/comment/files/upload', requireLogin, requirePermission, fileMiddleware.array('files', 5), reviewCommentFiles)

module.exports = router
