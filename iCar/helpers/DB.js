const fs = require('fs')
const path = require('path')

const dbPath = path.resolve(__dirname, '../users.json')
const users = require(dbPath)

var _instance

class DB {
  getUserById(id) {
    return users[id]
  }

  addUser(data) {
    const newId = Math.max(0, ...Object.keys(users)) + 1

    users[newId] = data

    this._save(JSON.stringify(users, null, 2))
  }

  updateUser(id, data) {
    if (!this.getUserById(id)) {
      throw new Error(`User with id ${id} not found`)
    }

    users[id] = data

    this._save(JSON.stringify(users, null, 2))
  }

  _save(data) {
    fs.writeFileSync(dbPath, data)
  }
}

module.exports = _instance ? _instance : new DB()
