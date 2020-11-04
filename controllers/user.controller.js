const { getUserFromDB, getUserData, saveModifiedUserRegular, confirmUserPassword, saveUserPassword } = require('../services/user.service')

exports.getUser = (req, res) => {
  const { _id } = req.user

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

exports.confirmPassword = (req, res) => {
  const { _id } = req.user
  const { password } = req.body

  confirmUserPassword(_id, password, res)
}

exports.editPassword = (req, res) => {
  const { _id } = req.user
  const { password } = req.body

  saveUserPassword(_id, password, res)
}
