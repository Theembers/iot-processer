const kafka = require('kafka-node')
const config = require('../config/config')

const client = new kafka.KafkaClient(config.kafka)

class ConsumerUtils {
  constructor(topic, partition = 0) {
    client.on('ready', function() {
      console.log('client is ready')
    })
    this.consumer = new kafka.Consumer(
      client,
      [{ topic: topic, partition: partition }]
    )
    this.consumer.on('error', function(err) {
      console.log('error', err)
    })
  }

  msg(msgFn) {
    this.consumer.on('message', msgFn)
  }
}

module.exports = ConsumerUtils
