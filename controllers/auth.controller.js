const User = require('../models/user.model')
const { saveNewUserAndOrganization, getUserAndLogin, saveTokenAndSendNewToken } = require('../services/auth.service')
const jwt = require('jsonwebtoken')

const expiresTime = parseInt(process.env.EXPIRES_TIME)

exports.register = async (req, res) => {
  const user = await User.findOne({ email: req.body.email })

  if (user) {
    return res.status(400).json({
      error: `Данный email уже используется!`
    })
  }

  await saveNewUserAndOrganization(req, res)
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

exports.refreshToken = (req, res) => {
  // Token must be in request HEADER
  const headerToken = req.headers.authorization.split(' ')[1]
  const refreshTime = parseInt(req.body.refresh)
  const nameOrg = req.body.nameOrg

  if (!headerToken) {
    return res.status(422).json({ message: 'Token not found' })
  }

  let decodedToken = jwt.verify(headerToken, process.env.ACCESS_TOKEN_SECRET, { ignoreExpiration: true })

  if (refreshTime <= Math.floor(Date.now() / 1000)) {
    return res.status(422).json({ error: 'Не удалось обновить токен, заново авторизируйтесь' })
  }

  saveTokenAndSendNewToken(res, { headerToken, decodedToken, nameOrg, expiresTime, refreshTime })
}

