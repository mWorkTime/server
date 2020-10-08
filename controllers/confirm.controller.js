const { verifyToken } = require('../utils/verify-token-from-req')
const { verifyEmail, generateAndSaveNewConfirmLink } = require('../services/confirm.service')

exports.confirmEmail = async (req, res) => {
  const { token } = req.body
  const { email } = verifyToken(token)

  await verifyEmail(token, email, res)
}

exports.resendLink = async (req, res) => {
  const { email } = req.body

  await generateAndSaveNewConfirmLink(email, res)
}
