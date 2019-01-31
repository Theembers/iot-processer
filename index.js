const Producer = require('./src/utils/ProducerUtils')
const Consumer = require('./src/utils/ConsumerUtils')

const topic = 'tcp-source-data'

const producer = new Producer()

let count = 0
// producer
//   .init()
//   .then(() => producer.createTopics([topic]))
//   .then(() => {
//     while (true) {
//       producer.send(topic, ['I am a messasge'])
//       count++
//       if (count > 10) return
//     }
//   })
//   .catch('error=> ' + console.error)

setTimeout(() => {
  const consumer = new Consumer(topic)
}, 3000)
