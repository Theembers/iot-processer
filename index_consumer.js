const Consumer = require('./src/utils/ConsumerUtils')


const topic = 'realtime-status-topic'
const consumer = new Consumer(topic)

consumer.msg(msg => {
  console.log(msg)
})
