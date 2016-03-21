'use strict'

const mongoose = require('mongoose')

var fileSchema = new mongoose.Schema({
  url: String
})

module.exports = exports = mongoose.model('File', fileSchema)
