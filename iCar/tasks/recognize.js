const fs = require('fs')
const cv = require('opencv')
const path = require('path')

const COLOR = [0, 255, 0]
const trainingDataPath = path.resolve(__dirname, '../data/training/faces.yml')
let _recognizer

class FaceRecognizer {
  constructor() {
    this.detector = new cv.CascadeClassifier(path.resolve(__dirname, '../data/detection/front-face.xml'))
  }

  get recognizer() {
    if (_recognizer) {
      return _recognizer
    }

    if (fs.existsSync(trainingDataPath)) {
      _recognizer = new cv.FaceRecognizer()
      _recognizer.loadSync(trainingDataPath)
    }

    return null
  }

  detectFaces(img) {
    return new Promise((resolve, reject) => {
      const image = img.clone()

      image.cvtColor('CV_BGR2GRAY')

      this.detector.detectMultiScale(image, (err, faces) => {
        if (err) reject(err)

        resolve(faces)
      }, 2.0, 5)
    })
  }

  recognizeFace(imageData, callback = () => null) {
    return new Promise((resolve, reject) => {
      const image = imageData.split(',')[1]

      cv.readImage(Buffer.from(image, 'base64'), (err, img) => {
        if (err) return reject(err)

        if (!img.width() || !img.height()) return

        this.detectFaces(img)
          .then(faces => {
            let data = { id: null, confidence: 100, position: null }

            if (faces.length) {
              this.reloadTrainingData()

              const face = faces[0]
              const { x, y, width, height } = face
              const crop = img.roi(x, y, width, height)

              crop.resize(64, 64)
              crop.cvtColor('CV_BGR2GRAY')
              crop.equalizeHist()

              const user = this.recognizer ? this.recognizer.predictSync(crop) : null

              data = Object.assign({}, user, { position: { x, y, width, height } })
            }

            resolve(data)
          })
          .catch(err => reject(err))
      })
    })
  }

  reloadTrainingData() {
    if (this.recognizer) {
      this.recognizer.loadSync(trainingDataPath)
    }
  }
}

module.exports = FaceRecognizer
