const cv = require('opencv')
const fs = require('fs-extra')
const path = require('path')
const async = require('async')

module.exports = id => {
  return new Promise((resolve, reject) => {
    const faceRecognizer = cv.FaceRecognizer.createLBPHFaceRecognizer()
    const baseTrainingDataPath = path.resolve(__dirname, '../data/training')
    const trainingDataPath = `${baseTrainingDataPath}/faces.yml`
    const baseUserFolderPath = path.resolve(__dirname, `../data/images/user${id}`)
    const files = fs.readdirSync(baseUserFolderPath)
    const images = []

    fs.ensureDirSync(baseTrainingDataPath)

    async.forEach(
      files,
      (filePath, done) => {
        if (/png/ig.test(filePath)) {
          cv.readImage(`${baseUserFolderPath}/${filePath}`, (err, img) => {
            if (!err) {
              img.resize(64, 64)

              images.push([id, img])
            }

            done(null)
          })
        }
      },
      err => {
        if (err) {
          return reject(err)
        }

        try {
          if (fs.existsSync(trainingDataPath)) {
            faceRecognizer.loadSync(trainingDataPath)
          }

          faceRecognizer.updateSync(images)
          faceRecognizer.saveSync(trainingDataPath)
        } catch (e) {
          return reject(e)
        }

        resolve()
      }
    )
  })
}
