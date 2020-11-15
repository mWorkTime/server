const { getEmployeesAndTasksById, getEmployees, saveNewTask, saveFilesForTask } = require('../services/task.service')

exports.getEmployeesAndTasks = async (req, res) => {
  const { _id, orgId } = req.user

  await getEmployeesAndTasksById({ _id, orgId }, res)
}

exports.getEmployeesByDepartment = async (req, res) => {
  const { orgId } = req.user
  const { department } = req.body

  await getEmployees({ orgId, department }, res)
}

exports.createTask = async (req, res) => {
  await saveNewTask(req.body, res)
}


