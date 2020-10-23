const User = require('../models/user.model')
const Organization = require('../models/organization.model')
const Role = require('../models/role.model')
const Department = require('../models/department.model')
const { removeWhitespace } = require('../utils/remove-whitespace')
const { sanitizeNumberPhone } = require('../utils/sanitize-phone-number')

/**
 * getEmployeesByOrgCode. Gets employees by organization code from DB.
 * @param {string} orgId
 * @param {object}  res
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

      if (!employees) {
        return res.status(200).json({
          employees: [{ isOwner, isSacked, gender, role, isVerified, name, email, department, createdAt }]
        })
      }

      let convertingEmployees = []

      for (let i = 0; i < employees.length; i++) {
        convertingEmployees.push({
          isOwner: employees[i].isOwner, isSacked: employees[i].isSacked,
          isVerified: employees[i].isVerified, role: employees[i].role,
          name: employees[i].name, department: employees[i].department,
          createdAt: employees[i].createdAt, email: employees[i].email,
          phone: employees[i].phone || 'не указан', surname: employees[i].surname
        })
      }

      res.status(200).json({
        employees: [...convertingEmployees, { isOwner, isSacked, gender, role, isVerified, name, email, department, createdAt }]
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
  const { orgId, roles, name, surname, email, password, phone, gender, department } = data

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

    const foundRoles = await Role.find({ 'role-code': { $in: roles } })

    const newEmployee = new User({
      name, surname, phone: phoneNumber, email, gender, password,
      isVerified: true, organization: organization._id
    })

    if (department.name && !department._id) {
      const newDepartment = new Department({ name: department.name })
      newEmployee.department = { name: department.name }
      newDepartment.save()
    } else {
      const foundDepartment = await Department.findOne({ _id: department._id })
      newEmployee.department = { name: foundDepartment.name }
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
