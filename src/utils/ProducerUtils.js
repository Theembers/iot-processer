const kafka = require('kafka-node')
const config = require('../config/config')

const client = new kafka.KafkaClient(config.kafka)

class ProducerUtils {
  constructor() {
    this.producer = new kafka.Producer(client)
  }

  createTopics(topics, async = true) {
    return new Promise((resolve, reject) => {
      console.log('create')
      this.producer.createTopics(topics, true, (error, data) => {
        if (error) return reject(error)
        return resolve(data)
      })
    })
  }

  send(topic, messages) {
    return new Promise((resolve, reject) => {
      this.producer.send([{ topic, messages: [messages] }], (error, data) => {
        if (error) return reject(error)
        return resolve(data)
      })
    })
  }

  // 发送
  sendBatch(msgData, topics) {
    if (!topics || !topics instanceof Array) {
      throw "topics can't be empty."
    }
    topics.forEach(t => {
      this.producer.send([{ topic: t, messages: msgData }], (error, data) => {
        console.log('<= sendding to ' + t)
        if (error !== null) {
          console.log('ERROR: ' + error, data)
        }
      })
    })
  }
}

module.exports = ProducerUtils
