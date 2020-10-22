const shortId = require('shortid')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const User = require('../models/user.model')
const Organization = require('../models/organization.model')
const Token = require('../models/token.model')
const Role = require('../models/role.model')
const BlockList = require('../models/blocklist.model')
const Department = require('../models/department.model')
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
  const codes = [0, 2, 3]

  try {
    const roles = await Role.find({ 'role-code': { $in: codes } })
    const newUser = new User({ name, email, password, isOwner: true })
    const department = await Department.findOne({ name: 'Главный отдел' })

    if (!department) {
      const newDepartment = new Department({ name: 'Главный отдел' })
      newUser.department = { name: newDepartment['name'] }
      newDepartment.save()
    } else {
      newUser.department = { name: department['name'] }
    }

    const newOrganization = new Organization({ name: organization, owner: newUser._id })
    newUser.organization = newOrganization._id

    for (let i = 0; i < roles.length; i++) {
      newUser.role.push({
        name: roles[i]['name'],
        code: roles[i]['role-code']
      })
    }

    const token = new Token({
      _userId: newUser._id,
      token: generateToken({ email }, { expiresIn: 86400 }),
      expireAfterSeconds: 86400
    })

    await newUser.validate()
    await token.validate()
    await newOrganization.validate()

    const link = `${process.env.CLIENT_URL}/confirm/${token.token}`

    await transporter.sendMail(registrationMail(email, link), (err) => {
      if (err) {
        return res.status(500).json({ msg: err.message })
      }

      token.save()
      newOrganization.save()
      newUser.save()

      res.status(200).json({ success: 'Регистрация прошла успешно. На Ваш электронный адрес отправлено письмо для подтверждения аккаунта!' })
    })
  } catch (err) {
    return res.status(500).json({ msg: err.message })
  }
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

      const { _id, isOwner } = user

      const token = generateToken({ _id, isOwner, orgId: user.organization._id }, { expiresIn: expiresTime })
      res.cookie('token', token, { expiresIn: expiresTime })

      res.status(200).json({
        token,
        user: _id,
        exp: Math.floor(Date.now() / 1000 + expiresTime)
      })
    })
}

/**
 * saveTokenAndSendNewToken. Save token that is came from params to block list, generate new token and send to user.
 * @param {Object} res
 * @param {Object} data
 * @return {*}
 */
exports.saveTokenAndSendNewToken = (res, data = {}) => {
  const { headerToken, decodedToken: { _id, isOwner, orgId }, expiresTime, refreshTime } = data

  return BlockList.findOne({ token: headerToken }).exec((err, token) => {
      if (err) {
        return res.status(500).json({ msg: err.message })
      } else if (token) {
        return res.status(422).json({ msg: 'Невозможно обновить токен.' })
      }

      const oldToken = new BlockList({ token: headerToken, expireAfterSeconds: 86400 })

      oldToken.save((err) => {
        if (err) {
          return res.status(500).json({ msg: 'Ошибка сохранения старого токена' })
        }

        res.status(200).json({
          token: generateToken({ _id, isOwner, orgId }, { expiresIn: expiresTime }),
          refresh: refreshTime,
          user: _id,
          exp: Math.floor(Date.now() / 1000 + expiresTime),
          success: 'Токен успешно обновлён'
        })
      })
    }
  )
}

