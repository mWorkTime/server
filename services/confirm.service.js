const User = require('../models/user.model')
const Token = require('../models/token.model')
const registrationMail = require('../emails/registration')

const { generateToken } = require('../utils/generate-token')
const { createTransport } = require('nodemailer')

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS
  }
})

/**
 * verifyEmail. Looking for token, user - verify account, save verify user and return response.
 * @param {string} token
 * @param {string} email
 * @param {object} res
 * @return {Promise<this>}
 */
exports.verifyEmail = async (token, email, res) => {
  const findToken = await Token.findOne({ token })

  if (!findToken) {
    return res.status(400).json({
      error: 'У ссылки истёк срок жизни. Нажмите на \"Получить ссылку\" и перейдите по ссылке снова!',
      needResend: true,
      needRegister: false
    })
  }

  const user = await User.findOne({ email })

  if (!user) {
    return res.status(400).json({
      error: 'Пользователь не обнаружен. Пожалуйста, зарегистрируйтесь',
      needRegister: true,
      needResend: false
    })
  } else if (user.isVerified) {
    return res.status(200).json({
      success: 'Ваш email был подтверждён ранее. Пожалуйста, войдите в систему!',
      needRegister: false,
      needResend: false
    })
  }

  user.isVerified = true
  await user.save((err) => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  return res.status(200).json({ success: 'Ваш аккаунт успешно подтверждён!', needRegister: false, needResend: false })
}

/**
 * generateAndSaveNewConfirmLink. Generate new token for confirm user.
 * @param {string} email
 * @param {object} res
 * @return {Promise<this>}
 */
exports.generateAndSaveNewConfirmLink = async (email, res) => {
  const user = await User.findOne({ email })

  if (!user) {
    return res.status(400).json({ error: 'Данного пользователя не существует, проверьте правильность ввода поля email!' })
  } else if (user.isVerified) {
    return res.status(422).json({ error: 'Ваш email уже подтверждён! Войдите в аккаунт!' })
  }

  const token = new Token({ _userId: user._id, token: generateToken({ email }, { expiresIn: 86400 }) })

  await token.save((err) => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  const link = `${process.env.CLIENT_URL}/confirm/${token.token}`

  await transporter.sendMail(registrationMail(user.email, link), (err) => {
    if (err) {
      return res.status(500).json({ msg: 'Technical Issue!, Please click on resend for verify your Email.' })
    }
  })

  return res.status(200).json({ success: 'Ссылка для подтверждения почты, успешно отправлена!' })
}
