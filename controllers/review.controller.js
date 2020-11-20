const { getAllTasksOnReviewById, getTaskAndConfirm } = require('../services/review.service')

exports.getAllTasksOnReview = (req, res) => {
  const { _id } = req.user

  getAllTasksOnReviewById(_id, res)
}

exports.confirmReviewTask = async (req, res) => {
  const { task_id } = req.body
  const { _id } = req.user

  await getTaskAndConfirm({ taskId: task_id, userId: _id }, res)
}
