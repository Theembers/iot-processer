const Producer = require('./src/utils/ProducerUtils')

const topic = 'a_topic'

const producer = new Producer()

let count = 0
producer
  .init()
  .then(() => producer.createTopics([topic]))
  .then(() => {
    while (true) {
      producer.send(topic, ['I am a messasge'])
      count++
      if (count > 10) return
    }
  })
  .catch('error=> ' + console.error)
