const { getAllTasksOnReviewById, getTaskAndConfirm, saveNewReviewComment } = require('../services/review.service')

exports.getAllTasksOnReview = (req, res) => {
  const { _id } = req.user

  getAllTasksOnReviewById(_id, res)
}

exports.confirmReviewTask = async (req, res) => {
  const { task_id } = req.body
  const { _id } = req.user

  await getTaskAndConfirm({ taskId: task_id, userId: _id }, res)
}

exports.reviewComment = (req, res) => {
  const { comment, taskId, createdBy } = req.body
  
  saveNewReviewComment({ comment, taskId, createdBy }, res)
}
