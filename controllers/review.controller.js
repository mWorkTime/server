const { getAllTasksOnReviewById, getTaskAndConfirm, saveNewReviewComment, updateReviewComment } = require('../services/review.service')

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

exports.reviewCommentFiles = async (req, res) => {
  const { comment_id, task_id } = req.body
  const { _id } = req.user

  await updateReviewComment(req.files, { commentId: comment_id, taskId: task_id, id: _id }, res)
}
