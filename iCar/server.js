const path = require('path')
const next = require('next')
const express = require('express')()
const server = require('http').Server(express)
const io = require('socket.io')(server)

const DB = require('./helpers/DB.js')
const FaceRecognizer = require('./tasks/recognize')
const saveUserPhoto = require('./tasks/save-user-photo')
const removeUser = require('./tasks/remove-user')
const trainUser = require('./tasks/train-user.js')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const nextHandler = app.getRequestHandler()
const faceRecognizer = new FaceRecognizer()

io.on('connection', socket => {
  socket.on('recognizeFace', imageData => (
    faceRecognizer.recognizeFace(imageData)
      .then(data => {
        const { id } = data
        const user = DB.getUserById(id)

        socket.emit('faceDetected', user ? Object.assign({}, data, user) : { position: data.position })
      })
  ))

  socket.on('saveUserPhoto', (imageData, id, fileName) => saveUserPhoto(imageData, id, fileName))

  socket.on('removeUser', id => removeUser(id))

  socket.on('trainUser', id => trainUser(id).then(() => socket.emit('userTrainned', id)))

  socket.on('saveUserSettings', (id, data) => DB.addOrUpdateUser(id, data))
})

app.prepare().then(() => {
  express.get('/users', (req, res) => {
    const data = require(path.resolve(__dirname, 'data/users.json'))

    return res.json(data)
  })

  express.get('*', (req, res) => nextHandler(req, res))

  server.listen(3000, err => {
    if (err) throw err

    console.log('> Ready on http://localhost:3000')
  })
})
