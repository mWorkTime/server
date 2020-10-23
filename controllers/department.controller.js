const { getDepartmentsFromDB, saveDepartmentInDB } = require('../services/department.service')

exports.getAllDepartments = (req, res) => {
  getDepartmentsFromDB(res)
}

exports.createDepartment = async (req, res) => {
  const { name_department } = req.body

  await saveDepartmentInDB(name_department, res)
}
