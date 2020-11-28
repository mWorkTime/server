const Task = require('../models/task.model')
const Report = require('../models/report.model')
const User = require('../models/user.model')
const File = require('../models/file.model')

/**
 * getAllTasksByUserId.
 * @param {string} userId
 * @param {object} res
 * @return {*}
 */
exports.getAllTasksByUserId = (userId, res) => {
  return User.findOne({ _id: userId }).populate('tasks').select('tasks')
    .exec((err, user) => {
      if (err) {
        res.status(500).json({ msg: err.message })
        return
      }

      res.status(200).json({ user })
    })
}

/**
 * getAllUsersByRole.
 * @param {object} data
 * @param {object} res
 * @return {*}
 */
exports.getAllUsersByRole = async (data, res) => {
  const { orgId, _id } = data

  try {
    const user = await User.findOne({ _id }).select('role department')

    let foundUsers = {}
    if (user.role.code && +user.role.code === 3) {
      foundUsers = await User.find({ organization: orgId }).select('name surname')
    }

    if (user.role.code && +user.role.code > 0 && +user.role.code < 3) {
      foundUsers = await User.find({ organization: orgId, department: { name: user.department.name } })
    }

    res.status(200).json({ users: foundUsers })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

/**
 * getUserTasksById
 * @param {string} _id
 * @param {object} res
 * @return {*}
 */
exports.getUserTasksById = (_id, res) => {
  return User.findOne({ _id }).populate('tasks').exec((err, user) => {
    if(err) {
      res.status(500).json({ msg: err.message })
      return
    }

    res.status(200).json({ user })
  })
}

/**
 * getTaskReportsById
 * @param {string} _id
 * @param {object} res
 * @return {*}
 */
exports.getTaskReportsById = (_id, res) => {
  return Task.findOne({ _id }).populate('reports').exec((err, task) => {
    if(err) {
      res.status(500).json({ msg: err.message })
      return
    }

    res.status(200).json({ task })
  })
}

/**
 * getTaskById.
 * @param {string} _id
 * @param {object} res
 * @return {*}
 */
exports.getTaskById = (_id, res) => {
  return Task.findOne({ _id }).select('isConfirmed priority runtime createdBy confirmedBy desc').exec((err, task) => {
    if (err) {
      res.status(500).json({ msg: err.message })
      return
    }

    res.status(200).json({ task })
  })
}

/**
 * saveNewReport
 * @param {object} data
 * @param {object} res
 * @return {Promise<void>}
 */
exports.saveNewReport = async (data, res) => {
  const { break_time, description, finish, start, id, total_time } = data
  try {
    const newReport = new Report({
      description,
      finish,
      start,
      total_time: parseInt(total_time),
      break_time: parseInt(break_time)
    })

    await Task.findOneAndUpdate({ _id: id }, { '$push': { reports: newReport._id } })
    await newReport.save()

    res.status(200).json({ success: 'Отчёт добавлен. Загрузите файлы для этого отчёта!', reportId: newReport._id })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

/**
 * saveFilesToReport.
 * @param {array} files
 * @param {string} id
 * @param {object} res
 */
exports.saveFilesToReport = async (files, id, res) => {
  try {
    let newFiles
    let arrLinks = []

    if (files.length > 1) {
      for (let i = 0; i < files.length; i++) {
        newFiles = new File({
          ...files[i],
          'original-name': files[i].originalname,
          ext: files[i].mimetype,
          name: files[i].filename
        })
        arrLinks.push(files[i].path)
        newFiles.save()
      }
    } else {
      newFiles = new File({
        ...files[0],
        'original-name': files[0].originalname,
        ext: files[0].mimetype,
        name: files[0].filename
      })
      arrLinks.push(files[0].path)
      newFiles.save()
    }

    await Report.findOneAndUpdate({ _id: id }, { 'report-files': arrLinks })

    res.status(200).json({ success: 'Файлы успешно загружены!' })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}
