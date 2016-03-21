'use strict'

const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
  user: String,
  status: String,
  gp: Number,
  avgPts: Number,
  fgPercentage: Number,
  url: String,
  files:
  [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File'
  }]
})

module.exports = exports = mongoose.model('User', userSchema)
