const User = require('../models/user.model')
const { saveNewUserAndOrganization, getUserAndLogin } = require('../services/auth.service')

const expiresTime = parseInt(process.env.EXPIRES_TIME)

exports.register = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (user) {
      return res.status(400).json({
        error: `Данный email уже используется!`
      })
    }

    await saveNewUserAndOrganization(req, res)
  } catch (err) {
    return res.status(400).json(err.message)
  }
}

exports.login = (req, res) => {
  const { email, password } = req.body

  getUserAndLogin(email, password, expiresTime, res)
}

exports.logout = (req, res) => {
  res.clearCookie('token')
  res.status(200).json({
    success: 'Вы вышли из учётной записи!'
  })
}

