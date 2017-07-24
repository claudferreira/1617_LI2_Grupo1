const path = require('path')
const fs = require('fs-extra')

const DB = require('../helpers/DB.js')

module.exports = id => {
  fs.removeSync(path.resolve(__dirname, `../data/images/user${id}`))

  DB.removeUser(id)
}
