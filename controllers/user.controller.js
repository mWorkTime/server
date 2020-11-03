const { verifyTokenFromReq } = require('../utils/verify-token-from-req')
const { getUserFromDB, getUserData, saveModifiedUserRegular } = require('../services/user.service')

exports.getUser = (req, res) => {
  const { _id } = verifyTokenFromReq(req)

  getUserFromDB(_id, res)
}

exports.getUserById = (req, res) => {
  const { _id } = req.user

  getUserData(_id, res)
}

exports.editUserRegular = (req, res) => {
  const { _id } = req.user

  saveModifiedUserRegular(_id, req.body, res)
}
