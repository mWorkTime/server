const User = require('../models/user.model')
const Task = require('../models/task.model')
const File = require('../models/file.model')
const zip = require('express-zip')
const crypto = require('crypto')

/**
 * getUsersOrTasksById. Depending on the user's role to return either users or tasks
 * @param {object} data
 * @param {object} res
 * @return {Promise<void>}
 */
exports.getEmployeesAndTasksById = async (data, res) => {
  const { _id, orgId } = data

  try {
    const employee = await User.findOne({ _id }).select('department role organization tasks name surname').populate('tasks')
    const department = employee.department.name

    const foundEmployees = await User.find({ department: { name: department }, organization: orgId })
    const managers = foundEmployees.reduce((acc, employee) => {
      if (employee.role.code > 0 && !employee.isSacked) {
        acc.push({ name: `${employee.name} ${employee.surname}`, id: employee._id })
      }

      return acc
    }, [])

    if (employee.role.code > 0) {
      res.status(200).json({
        tasks: employee.tasks, employees: foundEmployees,
        role: employee.role.code, name: employee.name + ' ' + employee?.surname,
        managers
      })
      return
    }

    res.status(200).json({ tasks: employee?.tasks, managers })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

/**
 * getEmployees. Depending on the user's department to return either users.
 * @param {object} data
 * @param {object} res
 */
exports.getEmployees = (data, res) => {
  const { orgId, department } = data

  User.find({ organization: orgId, department: { name: department } })
    .exec((err, employees) => {
      if (err) {
        res.status(500).json({ msg: err.message })
        return
      }

      res.status(200).json({ employees })
    })
}

/**
 * saveNewTask.
 * @param {object} data
 * @param {object} res
 * @return {Promise<void>}
 */
exports.saveNewTask = async (data, res) => {
  const { name, desc, runtime, priority, userId, createdBy } = data

  try {
    const newTask = new Task({
      name, desc, runtime, priority, user_id: userId, createdBy
    })

    await User.findOneAndUpdate({ _id: userId }, { '$push': { tasks: newTask._id } }, { upsert: true })
    await newTask.save()

    res.status(200).json({ success: 'Задача успешно сохранена. Теперь Вы можете загруть файлы!', task: newTask._id })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

/**
 * saveFilesForTask. Serialize files and save them
 * @param {array} files
 * @param {string} id
 * @param {object} res
 * @return {Promise<void>}
 */
exports.saveFilesForTask = async (files, id, res) => {
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

    await Task.findOneAndUpdate({ _id: id }, { filepath: arrLinks })

    res.status(200).json({ success: 'Файл(ы) для задачи успешно загружен(ы)' })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

/**
 * getFilesAndDownload. Download files by task id.
 * @param {string} _id
 * @param {object} res
 * @return {*}
 */
exports.getFilesAndDownload = (_id, res) => {
  return Task.findOne({ _id }).exec((err, task) => {
    if (err) {
      res.status(500).json({ msg: err.message })
      return
    }

    const { filepath } = task
    const files = filepath.reduce((acc, file) => {
      acc.push({ path: file, name: file.substr(6) })
      return acc
    }, [])

    res.zip(files, `${crypto.pseudoRandomBytes(4).toString('hex')}.zip`)
  })
}

/**
 * getCommentFiles. Looking for comments in task, gets files and return them to user.
 * @param {object} data
 * @param {object} res
 * @return {*}
 */
exports.getCommentFiles = (data, res) => {
  const { id, comment } = data
  return Task.findOne({ _id: id }).exec((err, task) => {
    if (err) {
      res.status(500).json({ msg: err.message })
      return
    }

    const commentIndex = task.comments.findIndex(({ key }) => key === comment)
    const commentItem = task.comments[commentIndex]

    if (commentItem && !commentItem.files) {
      res.redirect(`${process.env.CLIENT_URL}/tasks`)
      return
    }

    const files = commentItem.files.reduce((acc, file) => {
      acc.push({ path: file, name: file.substr(6) })
      return acc
    }, [])

    res.zip(files, `${crypto.pseudoRandomBytes(4).toString('hex')}.zip`)
  })
}

/**
 * updateTaskStatusById.
 * @param {string} id
 * @param {number|string} status
 * @param {object} res
 * @return {*}
 */
exports.updateTaskStatusById = ({ id, status }, res) => {
  return Task.findOneAndUpdate({ _id: id }, { status }, { new: true })
    .exec((err, task) => {
      if (err) {
        res.status(500).json({ msg: err.message })
        return
      }

      res.status(200).json({ success: 'Статус задачи успешно обновлён', task })
    })
}

/**
 * updateTaskStatusAndPutOnReview.
 * @param {string} manager
 * @param {string} taskId
 * @param {object} res
 * @return {*}
 */
exports.updateTaskStatusAndPutOnReview = async ({ manager, taskId }, res) => {
  try {
    const foundTask = await Task.findOneAndUpdate({ _id: taskId }, { status: 2 }, { new: true }).populate('user_id')

    const task = {
      _id: foundTask._id,
      isCompleted: foundTask.isCompleted,
      status: foundTask.status,
      isConfirmed: foundTask.isConfirmed,
      runtime: foundTask.runtime,
      filepath: foundTask.filepath,
      name: foundTask.name,
      desc: foundTask.desc,
      priority: foundTask.priority,
      createdBy: foundTask.createdBy,
      createdAt: foundTask.createdAt,
      updatedAt: foundTask.updatedAt,

      employee: {
        name: `${foundTask.user_id.name} ${foundTask.user_id?.surname}`,
        email: foundTask.user_id.email
      }
    }

    await User.findOneAndUpdate({ _id: manager }, { '$push': { onReview: task } }, { upsert: true })

    res.status(200).json({
      success: 'Напишите отчёт перейдя в \"Отчёты\". Задача была успешно отправлена на проверку!',
      task
    })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}
