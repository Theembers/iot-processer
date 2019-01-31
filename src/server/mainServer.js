const Base64 = require('js-base64').Base64
const RedisUtils = require('../utils/RedisUtils')
const config = require('../config/config')
const Consumer = require('../utils/ConsumerUtils')
const Producer = require('../utils/ProducerUtils')
const StringDataProcessorService = require('../service/StringDataProcessorService')
const JsonDataProcessorService = require('../service/JsonDataProcessorService')
const HexDataProcessorService = require('../service/HexDataProcessorService')
const DeviceData = require('../obj/DeviceData')

const server = function() {
  const redis = new RedisUtils()
  const consumer = new Consumer(config.topic)
  const producer = new Producer()
  // 监听 队列
  consumer.msg(msg => {
    // 解析 消息
    console.log('=> got msg', msg)
    const msgBody = JSON.parse(msg.value)
    const sourceData = msgBody.dataHex
    console.log('=> got sourceData', sourceData)
    const sn = msgBody.sn
    // 获取 redis 数据处理规则
    const attrTopicRules = redis.get('key-attr-topic-rule-' + sn)
    const dataChangeRules = redis.get('key-data-change-rule-' + sn)

    Promise.all([attrTopicRules, dataChangeRules]).then(results => {
      const attrTopicRules = JSON.parse(results[0])
      const dataChangeRules = JSON.parse(results[1])[config.name]
      // 获取 设备配置信息

      // 解析 数据
      // const pService = new StringDataProcessorService(sourceData)
      const pService = new JsonDataProcessorService(sourceData)
      // const pService = new HexDataProcessorService(sourceData)
      const datas = pService
        .loadProcessorRule(dataChangeRules)
        .run()
        .getData()
      // 封装 数据
      if (datas instanceof Array) {
        datas.forEach(data => {
          const deviceData = new DeviceData(
            sn,
            data.attr,
            data.val,
            msgBody.date
          )
          console.log(deviceData)
          const topics = attrTopicRules[data.attr]
          // 推送 topic
          producer.sendBatch(JSON.stringify(deviceData), topics)
        })
      }
    })
  })
}

server()
// console.log(Base64.decode('U2lnbmFsOjMwDQo='))

// new Consumer('realtime-status-topic').msg(msg => {
//   console.log('<= realtime-status-topic', msg)
// })

// new Consumer('pgsql-topic').msg(msg => {
//   console.log('<= pgsql-topic', msg)
// })

// 数据解析
// {
//   "str": {
//     "dataChangeFn": "const arr = data.split(':'); return[{attr: arr[0],val:arr[1]}];"
//   }
// }

// topic
// {
//   "Signal": [
//     "realtime-status-topic"
//   ]
// }
