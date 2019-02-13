const Producer = require('./src/utils/ProducerUtils')

const topic = 'JSON_TOPIC'

const producer = new Producer()

// let count = 0
// while (true) {
  producer.sendBatch('I am a messasge', [topic])
  // count++
  // if (count > 10) return
// }
