const cv = require('opencv')
const path = require('path')
const fs = require('fs-extra')

module.exports = (imageData, userId, fileName) => {
  const image = imageData.split(',')[1]

  cv.readImage(Buffer.from(image, 'base64'), (err, img) => {
    if (err) throw err

    if (!img.width() || !img.height()) return

    const baseFolderPath = path.resolve(__dirname, `../data/images/user${userId}`)

    fs.ensureDirSync(baseFolderPath)

    img.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
      if (err) throw err
      if (!faces.length) return

      const face = faces[0]
      const size = img.size()
      const crop = img.roi(face.x, face.y, face.width, face.height)

      crop.cvtColor('CV_BGR2GRAY')
      crop.equalizeHist()

      crop.save(`${baseFolderPath}/${fileName}.png`)
    })
  })
}
