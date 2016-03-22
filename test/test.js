'use strict'

let chai = require('chai')
let chaiHttp = require('chai-http')
chai.use(chaiHttp)

let request = chai.request
let expect = require('chai').expect
let url = require('url')
let fs = require('fs')
let mongoose = require('mongoose')
let User = require(__dirname + '/../models/users')
let File = require(__dirname + '/../models/files')

require(__dirname + '/../server')

describe('Testing User Router', () => {
  let userId
  let fileId
  beforeEach((done) => {
    let newUser = new User ({user: 'Stephen Curry', status: 'Active', gp: '482', avgPts: '22.2', fgPercentage: '47.7'})
    newUser.save((err, data) => {
      userId = data._id
      done()
    })
  })
  beforeEach((done) => {
    let newFile = new File ({fileName: 'Testing1.0', url: 'testing1.0.com'})
    newFile.save((err, data) => {
      fileId = data._id
      done()
    })
  })
  it('Should return a JSON object and Status 200', (done) => {
    request('localhost:8888')
    .get('/users')
    .end((err, res) => {
      expect(err).to.eql(null)
      expect(res.status).to.eql(200)
      expect(res).to.be.a('object')
      done()
    })
  })
  it('Should create a new user', (done) => {
    request('localhost:8888')
    .post('/users')
    .end((err, res) => {
      expect(err).to.eql(null)
      expect(res.status).to.eql(200)
      expect(res.body).to.be.a('object')
      done()
    })
  })
  it('Should find the user by ID in formed test', (done) => {
    request('localhost:8888')
    .get('/users/' + userId)
    .end((err, res) => {
      expect(err).to.be(null)
      expect(res.status).to.eql(200)
      expect(res.body).to.be.a('object')
      done()
    })
  })
  it('Should update specific user data in the database', (done) => {
    request('localhost:8888')
    .put('/users/' + userId)
    .send('{"user":"Stephen Curry"}')
    .end((err, res) => {
      expect(err).to.be(null)
      expect(res.status).to.eql(200)
      expect(res).to.be.a('object')
      done()
    })
  })
  it('Should delete a specific user from the database', (done) => {
    request('localhost:8888')
    .post('/users/' + userId)
    .send('{"fileName":"Testing", "url":"testing123.com"}')
    .end((err, res) => {
      expect(res.status).to.eql(200)
      done()
    })
  })
  it('Should find the file by ID in formed test', (done) => {
    request('localhost:8888')
    .get('files/' + fileId)
    .end((err, res) => {
      expect(err).to.eql(null)
      expect(res.status).to.eql(200)
      done()
    })
  })
})
