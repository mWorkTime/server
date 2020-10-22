const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
const debug = require('debug')
const databaseConnect = require('./utils/database-connect')
require('dotenv').config()

const log = debug('http')

// bring routes
const authRoutes = require('./routes/auth.route')
const confirmRoutes = require('./routes/confirm.route')
const userRoutes = require('./routes/user.route')
const employeeRoutes = require('./routes/employee.route')

// app
const app = express()
debug.enable('*')

//generate static path for images
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/files', express.static(path.join(__dirname, 'files')))

// middlewares
app.use(bodyParser.json())
app.use(cookieParser())

// cors
if (process.env.NODE_ENV === 'development') {
  app.use(cors({ origin: `${process.env.CLIENT_URL}` }))
}

app.use((req, res, next) => {
  log(req.method + ' ' + req.url)
  next()
})
app.use('/auth', authRoutes)
app.use('/confirm', confirmRoutes)
app.use('/user', userRoutes)
app.use('/employee', employeeRoutes)

// port
const port = process.env.PORT || 5000

// Connect to db
databaseConnect()

app.listen(port, (err) => {
  if (err) throw err
})
