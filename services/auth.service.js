const shortId = require('shortid')
const User = require('../models/user.model')
const Organization = require('../models/organization.model')
const crypto = require('crypto')

/**
 * saveNewUserAndOrganization. Create new user, organization and save them in DB.
 * @param {object} body
 * @param {object} res
 * @return {*}
 */
exports.saveNewUserAndOrganization = (body, res) => {
  const { name, email, organization, password } = body
  const username = shortId.generate()
  const codeOrganization = crypto.randomBytes(2).toString('hex')
  const newUser = new User({ name, email, password, username, isOwner: true })
  const newOrganization = new Organization({ name: organization, code: codeOrganization, owner: newUser._id })
  newUser.organization = newOrganization._id

  newOrganization.save((err) => {
    if (err) throw err
  })

  newUser.save((err) => {
    if (err) throw err
  })

  return res.status(200).json({ success: 'Регистрация прошла успешно' })
}
