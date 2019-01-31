# iot-processer

基于 nodejs + kafka + redis 实现的 物联网数据解码单元

## 说明

### 前置

数据接入端接入设备数据后，通过特征标示分类推送到 kafka 消息队列，等待 iot-processer 模块消费解码数据

### 配置

- config
```js

const config = {
  name: 'json', // 解码器名称，用于标记解码所需加载的规则标记 （json string Hex ..）
  topic: 'JSON_TOPIC', // 监听的topic，获取支持解码的数据
  redis: { // redis配置信息
    host: '192.168.0.201',
    port: 6379,
    db: 14
  },

  kafka: { // kafka配置信息
    kafkaHost: '192.168.10.120:6667,192.168.10.121:6667,192.168.10.122:6667'
  }
}
```

- 流程

![](https://image-1257148187.cos.ap-chengdu.myqcloud.com/picgo_img/20190131155928.png)
