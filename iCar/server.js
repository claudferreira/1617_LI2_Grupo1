const path = require('path')
const next = require('next')
const express = require('express')()
const server = require('http').Server(express)
const io = require('socket.io')(server)
const five = require('johnny-five')

const DB = require('./helpers/DB.js')
const FaceRecognizer = require('./tasks/recognize')
const saveUserPhoto = require('./tasks/save-user-photo')
const removeUser = require('./tasks/remove-user')
const trainUser = require('./tasks/train-user')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const nextHandler = app.getRequestHandler()
const faceRecognizer = new FaceRecognizer()
const board = new five.Board({ repl: false })

let seatLedBlinkTimout
let mirrorsLedBlinkTimout

let isConnected = false
let isUpdatingSettings = false

board.on('ready', () => {
  const startTrainingButton = new five.Button({ pin: 14, invert: true })
  const slaveButton = new five.Button({ pin: 15, invert: true })

  io.on('connection', socket => {
    if (isConnected) {
      return
    }

    isConnected = true

    startTrainingButton.on('press', () => socket.emit('start-training'))

    board.on('close', () => socket.emit('connection-status', { type: 'master', status: false }))
    slaveButton.on('press', () => socket.emit('connection-status', { type: 'slave', status: false }))
    slaveButton.on('release', () => socket.emit('connection-status', { type: 'slave', status: true }))

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

    socket.on('update-settings', (settings) => {
      if (isUpdatingSettings) {
        return
      }

      isUpdatingSettings = true

      const delay = 500
      const seatLed = new five.Led(8)
      const mirrorsLed = new five.Led(9)
      const seatValue = { 0: 2, 50: 4, 100: 8 }[settings.seat.value];
      const mirrorsValue = { 0: 2, 50: 4, 100: 8 }[settings.mirrors.value];

      clearTimeout(seatLedBlinkTimout)
      clearTimeout(mirrorsLedBlinkTimout)

      seatLed.on().blink(delay / 2)
      mirrorsLed.on().blink(delay / 2)

      seatLedBlinkTimout = setTimeout(() => {
        seatLed.stop().off()

        if (delay * seatValue > delay * mirrorsValue) {
          isUpdatingSettings = false
        }
      }, delay * seatValue + 50)

      mirrorsLedBlinkTimout = setTimeout(() => {
        mirrorsLed.stop().off()

        if (delay * mirrorsValue > delay * seatValue) {
          isUpdatingSettings = false
        }
      }, delay * mirrorsValue + 50)
    })
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
})
