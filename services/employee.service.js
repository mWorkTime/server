const User = require('../models/user.model')
const Organization = require('../models/organization.model')
const Department = require('../models/department.model')
const { removeWhitespace } = require('../utils/remove-whitespace')
const { sanitizeNumberPhone } = require('../utils/sanitize-phone-number')
const { getCountEmployees } = require('../utils/get-count-employees')
const emailTransporter = require('../emails/email-transporter')
const registrationEmployee = require('../emails/registration-employee')
const crypto = require('crypto')

/**
 * getEmployeesByOrgCode. Gets employees by organization code from DB.
 * @param {string} orgId
 * @param {object} res
 * @return {*}
 */
exports.getEmployeesByOrgCode = (orgId, res) => {
  return User.find({ organization: orgId })
    .exec((err, employees) => {
      if (err) {
        return res.status(500).json({ msg: err.message })
      }

      const convertingEmployees = employees.reduce((acc, employee) => {
        const { isSacked, isVerified, name, department, createdAt, email, role, _id, organization } = employee
        acc.push({
          id: _id, isSacked, isVerified, name: `${name} ${employee.surname || ''}`,
          department, createdAt, email, role, phone: employee.phone || 'не указан',
          organization
        })
        return acc
      }, [])

      res.status(200).json({
        employees: [...convertingEmployees],
        quantity: {
          total: employees.length,
          managers: getCountEmployees(employees, 2),
          owners: getCountEmployees(employees, 3),
          workers: getCountEmployees(employees, 0)
        }
      })
    })
}

/**
 * saveNewEmployee. Saving new employee in the DB.
 * @param {object} data
 * @param {object} res
 * @return {Promise<this>}
 */
exports.saveNewEmployee = async (data = {}, res) => {
  const { orgId, role, name, surname, email, phone, gender, department: { id } } = data

  try {
    const employee = await User.findOne({ email })
    const phoneNumber = sanitizeNumberPhone(removeWhitespace(phone))

    if (employee) {
      return res.status(400).json({ error: 'Пользователь с таким email-ом уже существует!' })
    }

    const organization = await Organization.findOne({ _id: orgId })

    if (!organization) {
      return res.status(400).json({ error: 'Такой организации не существует в нашей системе.' })
    }

    const password = crypto.randomBytes(4).toString('hex')
    const foundDepartment = await Department.findOne({ _id: id })

    const newEmployee = new User({
      name, surname, phone: phoneNumber, email, gender, password,
      isVerified: true, organization: organization._id, role
    })
    newEmployee.department = { name: foundDepartment.name }

    await newEmployee.validate()
    await emailTransporter.sendMail(registrationEmployee(email, password, organization.name, name))

    newEmployee.save()

    res.status(200).json({
      success: 'Работник успешно зарегистрирован и ему отправлено письмо на почту!'
    })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

/**
 * getEmployeeById. Gets user from DB.
 * @param {string} _id
 * @param {object} res
 * @return {*}
 */
exports.getEmployeeById = (_id, res) => {
  return User.findOne({ _id })
    .exec((err, user) => {
      if (err) {
        return res.status(500).json({ msg: err.message })
      }

      if (!user) {
        return res.status(400).json({ error: 'Такого пользователя не существует.' })
      }

      res.status(200).json({ user })
    })
}

/**
 *
 * @param {object} data
 * @param {string} editorId
 * @param {object} res
 * @return {*}
 */
exports.saveModifiedEmployee = async (data = {}, editorId ,res) => {
  const { gender, name, phone, role, surname, department, userId } = data
  const phoneNumber = sanitizeNumberPhone(removeWhitespace(phone))

  try {
    const foundUsers = await User.find({ _id: { $in: [editorId, userId] } })

    const permissions = foundUsers.reduce((acc, user) => {
      return {
        ...acc,
        [user._id]: user.role.code
      }
    }, {})

    if (permissions[editorId] < permissions[userId]) {
      return res.status(400).json({ error: 'Вы не можете изменить данные работника. Причина: Не хватает прав доступа' })
    }

    User.findOneAndUpdate({ _id: userId }, { gender, name, phone: phoneNumber, role, surname, department }, { new: true })
      .exec((err, user) => {
        if (err) {
          return res.status(500).json({ msg: err.message })
        }

        res.status(200).json({ success: 'Данные пользователя успешно изменены!', user })
      })

  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

const dismissOrRecoverEmployee = async (data, value, res) => {
  const { _id, userId } = data

  try {
    const foundUsers = await User.find({ _id: { $in: [_id, userId] } })

    const permissions = foundUsers.reduce((acc, user) => {
      return {
        ...acc,
        [user._id]: user.role.code
      }
    }, {})

    if (permissions[_id] < permissions[userId]) {
      return res.status(400).json({ error: 'Вы не можете уволить работника. Причина: Не хватает прав доступа' })
    }

    User.findOneAndUpdate({ _id: userId }, { isSacked: value }, { new: true })
      .exec((err, user) => {
          if (err) {
            return res.status(500).json({ msg: err.message })
          }

          res.status(200).json({ success: 'Работник успешно уволен!', user })
        }
      )
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

/**
 * saveDismissedEmployee. Finds an employee in DB and changes the status of isSacked to true.
 * @param {object} data
 * @param {object} res
 * @return {*}
 */
exports.saveDismissedEmployee = async (data = {}, res) => {
 await dismissOrRecoverEmployee(data, true, res)
}

/**
 * saveDismissedEmployee. Finds an employee in DB and changes the status of isSacked to false..
 * @param {object} data
 * @param {object} res
 * @return {*}
 */
exports.saveRecoverEmployee = async (data = {}, res) => {
  await dismissOrRecoverEmployee(data, false, res)
}
