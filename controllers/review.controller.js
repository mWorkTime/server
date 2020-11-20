const { getAllTasksOnReviewById } = require('../services/review.service')

exports.getAllTasksOnReview = (req, res) => {
  const { _id } = req.user
  
  getAllTasksOnReviewById(_id, res)
}
