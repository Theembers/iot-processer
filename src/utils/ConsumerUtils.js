const kafka = require('kafka-node')
const config = require('../config/config')

const client = new kafka.KafkaClient(config.kafka)

class ConsumerUtils {
  constructor(topic, partition = 0) {
    this.consumer = new kafka.Consumer(client, [
      { topic: topic, partition: partition }
    ])
  }

  msg(msgFn) {
    this.consumer.on('message', msgFn)
  }
}

module.exports = ConsumerUtils
