const User = require('../models/user.model')
const { saveNewUserAndOrganization } = require('../services/auth.service')

exports.register = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (user) {
      return res.status(422).json({
        error: `Данный email уже используется!`
      })
    }

    await saveNewUserAndOrganization(req.body, res)
  } catch (err) {
    return res.status(400).json(err)
  }
}


