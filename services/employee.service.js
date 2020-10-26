const User = require('../models/user.model')
const Organization = require('../models/organization.model')
const Role = require('../models/role.model')
const Department = require('../models/department.model')
const { removeWhitespace } = require('../utils/remove-whitespace')
const { sanitizeNumberPhone } = require('../utils/sanitize-phone-number')
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
  return Organization.findOne({ _id: orgId }).populate('owner')
    .exec((err, organization) => {
      if (err) {
        return res.status(500).json({ msg: err.message })
      }
      const { employees, owner } = organization
      const { isOwner, isSacked, gender, role, isVerified, name, email, department, createdAt } = owner
      const convertingOwner = { isOwner, isSacked, gender, role, isVerified, name, email, department, createdAt }

      if (!employees) {
        return res.status(200).json({
          employees: [convertingOwner]
        })
      }

      const convertingEmployees = employees.reduce((acc, employee) => {
        const { isOwner, isSacked, isVerified, name, department, createdAt, email, surname, role, gender } = employee
        acc.push({
          isOwner, isSacked, isVerified, name,
          department, createdAt, email, surname, role, phone: employee.phone || 'не указан', gender
        })
        return acc
      }, [])

      res.status(200).json({
        employees: [...convertingEmployees, convertingOwner]
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
  const { orgId, roles, name, surname, email, phone, gender, department: { id } } = data

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
    const foundRoles = await Role.find({ _id: { $in: roles } })
    const foundDepartment = await Department.findOne({ _id: id })

    const newEmployee = new User({
      name, surname, phone: phoneNumber, email, gender, password,
      isVerified: true, organization: organization._id
    })
    newEmployee.department = { name: foundDepartment.name }

    for (let i = 0; i < foundRoles.length; i++) {
      newEmployee.role.push({
        name: foundRoles[i]['name'],
        code: foundRoles[i]['role-code']
      })
    }
    organization.employees.push(newEmployee)

    await newEmployee.validate()
    await emailTransporter.sendMail(registrationEmployee(email, password, organization.name, name), (err) => {
      if (err) {
        return res.status(500).json({ msg: err.message })
      }
      newEmployee.save()
      organization.save()

      res.status(200).json({ success: 'Работник успешно зарегистрирован и отправлено письмо на почту!' })
    })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}
