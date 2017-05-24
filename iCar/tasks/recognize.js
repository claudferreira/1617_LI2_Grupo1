const fs = require('fs')
const cv = require('opencv')
const path = require('path')

const COLOR = [0, 255, 0]
const trainningDataPath = path.resolve(__dirname, '../data/trainning/faces.yml')

class FaceRecognizer {
  constructor() {
    this.detector = new cv.CascadeClassifier(path.resolve(__dirname, '../data/detection/front-face.xml'))

    if (fs.existsSync(trainningDataPath)) {
      this.recognizer = new cv.FaceRecognizer()
      this.recognizer.loadSync(trainningDataPath)
    }
  }

  detectFaces(img) {
    return new Promise((resolve, reject) => {
      const image = img.clone()

      image.cvtColor('CV_BGR2GRAY')

      this.detector.detectMultiScale(image, (err, faces) => {
        if (err) reject(err)

        resolve(faces)
      }, 1.3, 5)
    })
  }

  recognizeFace(imageData, callback = () => null) {
    const image = imageData.split(',')[1]

    cv.readImage(Buffer.from(image, 'base64'), (err, img) => {
      if (err) throw err

      if (!img.width() || !img.height()) return

      this.detectFaces(img)
        .then(faces => {
          let data = { id: null, confidence: 100, position: null }

          if (faces.length) {
            img.cvtColor('CV_BGR2GRAY')

            const face = faces[0]
            const { x, y, width, height } = face
            const user = this.recognizer ? this.recognizer.predictSync(img) : null

            data = Object.assign({}, user, { position: { x, y, width, height } })
          }

          callback(data)
        })
        .catch(err => { throw err })
    })
  }
}

module.exports = FaceRecognizer
