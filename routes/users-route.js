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
  apiRouter.route('/users')
  .get((req, res) => {
    User.find({}, (err, data) => {
      if (err) return handleDBError(err, res)
      res.status(200).json(data)
      console.log('Showing All User Data');
      res.end()
    })
  })
  .post((req, res) => {
    req.on('data', (data) => {
      req.body = JSON.parse(data)
      var newUser = new User(req.body)
      newUser.save((err, data) => {
        if (err) return handleDBError(err, res)
        res.status(200).json(data)
        console.log('User Added');
        res.end()
      })
    })
  })

  apiRouter.route('/users/:user')
  .get((req, res) => {
    User.findById(req.params.user, (err, user) => {
      res.json(user)
      res.status(200)
      console.log('Showing Specific User Data');
      res.end()
    })
  })
  .put((req, res) => {
    req.on('data', (data) => {
      req.body = JSON.parse(data)
      console.log(req.body);
      User.update({_id: req.params.user}, req.body, (err, user) => {
        if (err) return handleDBError(err, res)
        res.type('json')
        res.json(req.body)
        res.status(200)
        console.log('User Updated');
        res.end()
      })
    })
  })
  .delete((req, res) => {
    User.findById(req.params.user, (err, user) => {
      user.remove((err, user) => {
        res.type('json')
        res.json(user)
        res.status(200)
        console.log('User Deleted');
        res.end()
      })
    })
  })

  apiRouter.route('/users/:user/files')
  .get((req, res) => {
    User.findById(req.params.user, (err, user) => {
      res.json(user)
      res.end()
    })
  })
  .post((req, res) => {
    req.on('data', (data) => {
      req.body = JSON.parse(data)
      var params = {
        Bucket: 'dh-interfacing-s3-user-files',
        Key: req.body.fileName,
        ACL: 'public-read-write',
        Body: req.body.content
      }
      console.log(params);
      s3.putObject(params, (err, data) => {
         if (err) throw (err)
      })
      s3.getSignedUrl('putObject', params, (err, url) => {
        var newFileId
        var newUrl = new File({url: url, title: req.body.fileName})
        newFileId = newUrl._id
        console.log(newFileId);
        newUrl.save((err, url) => {
          User.findByIdAndUpdate(req.params.user, {$push: {files: newFileId}}, (err, user) => {
            res.status(200)
            res.json(user)
            res.end()
          })
        })
      })
    })
  })
}
