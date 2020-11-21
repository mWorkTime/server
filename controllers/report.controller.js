const { getTaskById, getAllTasksByUserId, saveNewReport, saveFilesToReport } = require('../services/report.service')

exports.getAllTasksForReport = (req, res) => {
  const { _id } = req.user
  getAllTasksByUserId(_id, res)
}

exports.getTask = (req, res) => {
  const { task } = req.body

  getTaskById(task, res)
}

exports.createReport = async (req, res) => {
  await saveNewReport(req.body, res)
}

exports.uploadReportFiles = async (req, res) => {
  const { reportId } = req.body
  await saveFilesToReport(req.files, reportId, res)
}
