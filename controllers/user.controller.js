const { verifyTokenFromReq } = require('../utils/verify-token-from-req')
const { getUserFromDB } = require('../services/user.service')

exports.getUser = (req, res) => {
  const userId = verifyTokenFromReq(req, res)._id

  getUserFromDB(userId, res)
}
