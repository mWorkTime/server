const User = require('../models/user.model')
const { saveNewUserAndOrganization } = require('../services/auth.service')
const { generateToken } = require('../utils/generate-token')

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

  User.findOne({ email }).populate('organization')
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({ msg: err.message })
      } else if (!user) {
        return res.status(400).json({ error: 'Адрес электронной почты не связан ни с одной учетной записью. Пожалуйста, проверьте и попробуйте еще раз!' })
      } else if (!user.authenticate(password)) {
        return res.status(400).json({ error: 'Введён неправильный пароль!' })
      } else if (!user.isVerified) {
        return res.status(400).json({ error: 'Ваша почта не была подтверждена. Пожалуйста сделайте это!' })
      }

      const { _id, username, isOwner, name } = user

      const token = generateToken({
        _id,
        username,
        isOwner,
        orgName: user.organization.name,
        orgCode: user.organization.code
      }, { expiresIn: expiresTime })
      res.cookie('token', token, { expiresIn: expiresTime })

      res.status(200).json({
        token,
        user: { username, name, isOwner },
        organization: { name: user.organization.name, code: user.organization.code },
        exp: Math.floor(Date.now() / 1000 + expiresTime),
        success: 'Вы успешно авторизованы!'
      })
    })
}

exports.logout = (req, res) => {
  res.clearCookie('token')
  res.status(200).json({
    success: 'Вы вышли из учётной записи!'
  })
}
