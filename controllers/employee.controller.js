const { saveNewEmployee, getEmployeesByOrgCode, getEmployeeById, saveModifiedEmployee, saveDismissedEmployee, saveRecoverEmployee } = require('../services/employee.service')

exports.getAllEmployees = (req, res) => {
  const { orgId } = req.user
  const currentPage = parseInt(req.query.currentPage)
  const limit = parseInt(req.query.limit)

  const data = { orgId, currentPage, limit }
  getEmployeesByOrgCode(data, res)
}

exports.getEmployee = (req, res) => {
  const userId = req.params.id

  getEmployeeById(userId, res)
}

exports.createEmployee = async (req, res) => {
  const { _id, orgId } = req.user
  const { role, name, surname, email, phone, gender, department } = req.body

  await saveNewEmployee({ _id, orgId, role, name, surname, email, phone, gender, department }, res)
}

exports.editEmployee = (req, res) => {
  const { _id } = req.user

  saveModifiedEmployee(req.body, _id, res)
}

exports.dismissEmployee = (req, res) => {
  const { userId } = req.body
  const { _id } = req.user

  if (_id === userId) {
    res.status(400).json({ error: 'Вы не можете уволить самого себя!' })
    return
  }

  saveDismissedEmployee({ _id, userId }, res)
}

exports.recoverEmployee = (req, res) => {
  const { userId } = req.body
  const { _id } = req.user

  if (_id === userId) {
    res.status(400).json({ error: 'Вы не можете восстановить самого себя!' })
    return
  }

  saveRecoverEmployee({ _id, userId }, res)
}
