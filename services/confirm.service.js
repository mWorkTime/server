const User = require('../models/user.model')
const Token = require('../models/token.model')
const registrationMail = require('../emails/registration')
const emailTransporter = require('../emails/email-transporter')
const { generateToken } = require('../utils/generate-token')

/**
 * verifyEmail. Looking for token, user - verify account, save verify user and return response.
 * @param {object}
 * @param {object} res
 * @return {Promise<this>}
 */
exports.verifyEmail = async ({ email, token }, res) => {
  try {
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
    await user.save()

    res.status(200).json({ success: 'Ваш аккаунт успешно подтверждён!', needRegister: false, needResend: false })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

/**
 * generateAndSaveNewConfirmLink. Generate new token for confirm user.
 * @param {string} email
 * @param {object} res
 * @return {Promise<this>}
 */
exports.generateAndSaveNewConfirmLink = async (email, res) => {
  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ error: 'Данного пользователя не существует, проверьте правильность ввода поля email!' })
    } else if (user.isVerified) {
      return res.status(422).json({ error: 'Ваш email уже подтверждён! Войдите в аккаунт!' })
    }

    const token = new Token({ _userId: user._id, token: generateToken({ email }, { expiresIn: 86400 }) })
    const link = `${process.env.CLIENT_URL}/confirm/${token.token}`

    await token.save()

    await emailTransporter.sendMail(registrationMail(user.email, link, user.name))

    res.status(200).json({ success: 'Ссылка для подтверждения почты, успешно отправлена!' })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}
