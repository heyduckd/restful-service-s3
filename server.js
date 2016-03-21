'use strict'

const express = require('express')
const app = express()
const mongo = require('mongodb')
const mongoose = require('mongoose')
const jsonParser = require('body-parser')

app.use(jsonParser.json())

let apiRouter = express.Router()
app.use('/', apiRouter, (req, res) => {
})
require('./routes/files-route')(apiRouter)
require('./routes/users-route')(apiRouter)

mongoose.connect('mongodb://localhost/db')


app.listen(3000, () => {
  console.log('Listening on port 3000');
})
