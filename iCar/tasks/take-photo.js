const cv = require('opencv')
const path = require('path')

class PhotoTaker {
  constructor() {

  }

  save(imageData, name) {
    const image = imageData.split(',')[1]

    cv.readImage(Buffer.from(image, 'base64'), (err, img) => {
      if (err) throw err

      if (!img.width() || !img.height()) return

      img.save(path.resolve(__dirname, `../data/images/${name}.png`))
    })
  }
}

module.exports = PhotoTaker
