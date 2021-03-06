'use strict'

const express = require('express')
const jsonParser = require('body-parser').json()
const User = require(__dirname + '/../models/users')
const File = require(__dirname + '/../models/files')
const handleDBError = require(__dirname + '/../lib/handle-db-err')
const http = require('http')
const fs = require('fs')

var AWS = require('aws-sdk')
var s3 = new AWS.S3()

module.exports = (apiRouter) => {
  apiRouter.route('/files/:id')
  .get((req, res) => {
    File.find({}, (err, data) => {
      if (err) return handleDBError(err, res)
      res.status(200).json(data)
      console.log('Showing Specific File Data');
      res.end()
    })
  })
  .put((req, res) => {
    File.update({_id: req.params.id}, req.body, (err, file) => {
      if (err) return handleDBError(err, res)
      res.type('json')
      res.json(file)
      res.status(200)
      console.log('File Updated');
      res.end()
    })
  })
  .delete((req, res) => {
    File.findById(req.params.id, (err, file) => {
      let params = {
        Bucket: 'dh-interfacing-s3-user-files',
        Key: req.body.fileName
      }
      s3.deleteObject(params, (err, data) => {
        if (err) handleDBError(err, res)
      })
      File.remove((err, file) => {
        res.status(200)
        res.json(file)
        console.log('The ' + file + ' has been deleted');
        res.end()
      })
    })
  })
}
