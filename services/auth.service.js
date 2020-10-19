const shortId = require('shortid')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const User = require('../models/user.model')
const Organization = require('../models/organization.model')
const Token = require('../models/token.model')
const registrationMail = require('../emails/registration')
const { generateToken } = require('../utils/generate-token')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS
  }
})

/**
 * saveNewUserAndOrganization. Create new user, organization and save them in DB.
 * @param {object} req
 * @param {object} res
 * @return {*}
 */
exports.saveNewUserAndOrganization = async (req, res) => {
  const { name, email, organization, password } = req.body
  const username = shortId.generate()
  const codeOrganization = crypto.randomBytes(2).toString('hex')
  const newUser = new User({ name, email, password, username, isOwner: true })
  const newOrganization = new Organization({ name: organization, code: codeOrganization, owner: newUser._id })
  const token = new Token({
    _userId: newUser._id,
    token: generateToken({ email }, { expiresIn: 86400 }),
    expireAfterSeconds: 86400
  })
  newUser.organization = newOrganization._id

  token.save((err) => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  newOrganization.save((err) => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  newUser.save((err) => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  const link = `${process.env.CLIENT_URL}/confirm/${token.token}`

  await transporter.sendMail(registrationMail(email, link), (err) => {
    if (err) {
      return res.status(500).json({ msg: 'Technical Issue!, Please click on resend for verify your Email.' })
    }
  })

  return res.status(200).json({ success: 'Регистрация прошла успешно. На Ваш электронный адрес отправлено письмо для подтверждения аккаунта!' })
}

/**
 * getUserAndLogin. Looking for user in DB and return data for authorized him.
 * @param {string} email
 * @param {string} password
 * @param {number} expiresTime
 * @param {object} res
 * @return {*}
 */
exports.getUserAndLogin = (email, password, expiresTime, res) => {
  return User.findOne({ email }).populate('organization')
    .exec((err, user) => {
      if (err) {
        return res.status(500).json({ msg: err.message })
      } else if (!user) {
        return res.status(400).json({ error: 'Адрес электронной почты не связан ни с одной учетной записью. Пожалуйста, проверьте и попробуйте еще раз!' })
      } else if (!user.authenticate(password)) {
        return res.status(400).json({ error: 'Введён неправильный пароль!' })
      } else if (!user.isVerified) {
        return res.status(400).json({ error: 'Ваша почта не была подтверждена. Пожалуйста сделайте это!' })
      }

      const { _id, username, isOwner } = user

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
        user: { username },
        exp: Math.floor(Date.now() / 1000 + expiresTime)
      })
    })
}

