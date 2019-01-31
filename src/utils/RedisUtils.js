const redis = require('redis')
const config = require('../config/config')

const client = redis.createClient(config.redis)

class RedisUtils {
  set(key, data) {
    client.set(key, data)
  }
  get(key) {
    return new Promise((resolve, reject) => {
      client.get(key, function(err, v) {
        if (err) return reject(err)
        return resolve(v)
      })
    })
  }
}
module.exports = RedisUtils
