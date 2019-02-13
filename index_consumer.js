const Consumer = require('./src/utils/ConsumerUtils')


const topic = 'JSON_TOPIC'
const consumer = new Consumer(topic)
console.log(123)
consumer.msg(msg => {
  console.log(msg)
})
