const path = require('path')
const fs = require('fs-extra')

module.exports = id => {
  fs.removeSync(path.resolve(__dirname, `../data/images/user${id}`))
}
