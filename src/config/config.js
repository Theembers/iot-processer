const config = {
  name: 'json',
  topic: 'JSON_TOPIC',
  redis: {
    host: '192.168.0.201',
    port: 6379,
    db: 14
  },

  kafka: {
    kafkaHost: '192.168.10.120:6667,192.168.10.121:6667,192.168.10.122:6667'
  }
}

module.exports = config
