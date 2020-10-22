const User = require('../models/user.model')
const Organization = require('../models/organization.model')
const Role = require('../models/role.model')
const Department = require('../models/department.model')
const crypto = require('crypto')
const shortId = require('shortid')

/**
 * saveNewEmployee. Saving new employee in the DB.
 * @param {object} data
 * @param {object} res
 * @return {Promise<this>}
 */
exports.saveNewEmployee = async (data = {}, res) => {
  const { orgCode, roles, name, surname, email, password, phone, gender, department } = data

  try {
    const employee = await User.findOne({ email })
    const username = shortId.generate()

    if (employee) {
      return res.status(400).json({ error: 'Пользователь с таким email-ом уже существует!' })
    }

    const organization = await Organization.findOne({ code: orgCode })

    if (!organization) {
      return res.status(400).json({ error: 'Такой организации не существует в нашей системе.' })
    }

    const foundRoles = await Role.find({ 'role-code': { $in: roles } })

    const newEmployee = new User({
      name, surname, username, phone, email, gender, password, isVerified: true, organization: organization._id
    })

    if (department.name && !department.code) {
      const codeDepartment = crypto.randomBytes(4).toString('hex')
      const newDepartment = new Department({ name: department.name, 'code-department': codeDepartment })
      newEmployee.department = { name: department.name, code: newDepartment['code-department'] }
      newDepartment.save()
    } else {
      const foundDepartment = await Department.findOne({ 'code-department': department.code })
      newEmployee.department = { name: foundDepartment.name, code: foundDepartment['code-department'] }
    }

    for (let i = 0; i < foundRoles.length; i++) {
      newEmployee.role.push({
        name: foundRoles[i]['name'],
        code: foundRoles[i]['role-code']
      })
    }
    organization.employees.push(newEmployee)

    await newEmployee.validate()
    newEmployee.save()
    organization.save()

    res.status(200).json({ success: 'Работник успешно зарегистрирован!' })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}
