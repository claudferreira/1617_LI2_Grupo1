const path = require('path')
const next = require('next')
const express = require('express')()
const server = require('http').Server(express)
const io = require('socket.io')(server)

const DB = require('./helpers/DB.js')
const FaceRecognizer = require('./tasks/recognize')
const FaceTrainer = require('./tasks/train')
const PhotoTaker = require('./tasks/take-photo')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const nextHandler = app.getRequestHandler()
const faceRecognizer = new FaceRecognizer()
const photoTaker = new PhotoTaker()

io.on('connection', socket => {
  socket.on('recognizeFace', imageData => (
    faceRecognizer.recognizeFace(imageData, data => {
      const { id } = data
      // ToDo: handle unknown users
      const user = DB.getUserById(id)

      socket.emit('faceDetected', user ? Object.assign({}, data, user) : { position: data.position })
    })
  ))

  socket.on('savePhoto', photoTaker.save)
})

app.prepare().then(() => {
  express.get('/users', (req, res) => {
    const data = require(path.resolve(__dirname, 'users.json'))

    return res.json(data)
  })

  express.get('*', (req, res) => nextHandler(req, res))

  server.listen(3000, err => {
    if (err) throw err

    console.log('> Ready on http://localhost:3000')
  })
})
