const RedisUtils = require('./src/utils/RedisUtils')

const redis = new RedisUtils()

redis.set('hello', 'This is a value')
redis.get('hello').then(result => {
  console.log(result)
})
