const fs = require('fs')
const path = require('path')

const dbPath = path.resolve(__dirname, '../data/users.json')
var _instance

class DB {
  getUserById(id) {
    const users = require(dbPath)

    return users[id]
  }

  addOrUpdateUser(id, data) {
    const users = require(dbPath)

    users[id] = data

    this._save(JSON.stringify(users, null, 2))
  }

  _save(data) {
    fs.writeFileSync(dbPath, data)
  }
}

module.exports = _instance ? _instance : new DB()
