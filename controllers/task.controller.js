const { getEmployeesAndTasksById, getEmployees, saveNewTask, saveFilesForTask, getFilesAndDownload,
  updateTaskStatusById, updateTaskStatusAndPutOnReview, getCommentFiles } = require('../services/task.service')

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

exports.uploadFile = async (req, res) => {
  const files = req.files
  const { task_id } = req.body

  await saveFilesForTask(files, task_id, res)
}

exports.downloadFiles = (req, res) => {
  const { id } = req.params
  getFilesAndDownload(id, res)
}

exports.commentFilesDownload = (req, res) => {
  getCommentFiles(req.params, res)
}

exports.updateTaskStatus = (req, res) => {
  const { id, status } = req.body

  updateTaskStatusById({ id, status }, res)
}

exports.putTaskOnReview = (req, res) => {
  updateTaskStatusAndPutOnReview(req.body, res)
}
