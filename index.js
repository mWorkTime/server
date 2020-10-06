const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
const debug = require('debug')
const databaseConnect = require('./utils/database-connect')
require('dotenv').config()

// app
const app = express()

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

// port
const port = process.env.PORT || 5000

// Connect to db
databaseConnect()

app.listen(port, (err) => {
  if (err) throw err
  console.log(`> Server ready on http://localhost:${port}`)
})
