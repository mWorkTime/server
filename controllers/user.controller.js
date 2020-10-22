const { verifyTokenFromReq } = require('../utils/verify-token-from-req')
const { getUserFromDB } = require('../services/user.service')

exports.getUser = (req, res) => {
  const { _id } = verifyTokenFromReq(req)

  getUserFromDB(_id, res)
}
