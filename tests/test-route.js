const express = require('express')
const router = express.Router()
const Role = require('../models/role')

router.post('/test', async (req, res) => {

  const newRole = new Role({
    name: 'Some role',
    'code': 12
  })

  await newRole.save((err) => {
    if (err) return res.status(500).json({ error: err._message })
    return res.status(200).json({ msg: 'Successful' })
  })
})
