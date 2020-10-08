const shortId = require('shortid')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const User = require('../models/user.model')
const Organization = require('../models/organization.model')
const Token = require('../models/token.model')
const registrationMail = require('../emails/registration')

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
  const token = new Token({ _userId: newUser._id, token: crypto.randomBytes(16).toString('hex') })
  newUser.organization = newOrganization._id

  token.save((err) => {
    if (err) return res.status(500).send({ msg: err.message })
  })

  newOrganization.save((err) => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  newUser.save((err) => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  const text = 'Hello ' + name + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + email + '\/' + token.token + '\n\nThank You!\n'

  await transporter.sendMail(registrationMail(email, text), (err) => {
    if (err) {
      return res.status(500).json({ msg: 'Technical Issue!, Please click on resend for verify your Email.' })
    }
  })

  return res.status(200).json({ success: 'Регистрация прошла успешно. На Ваш электронный адрес отправлено письмо для подтверждения аккаунта!' })
}
