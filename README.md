# iot-processer

基于 nodejs + kafka + redis 实现的 编程式物联网数据解码单元

## 特点

- 编程式解码规则定义
  基于 JavaScript 脚本语言特性，支持自定义编程式解码规则
- 分布式支持

## 说明

### 前置

数据接入端接入设备数据后，通过特征标示分类推送到 kafka 消息队列，等待 iot-processer 模块消费解码数据

### 环境依赖

- node

- kafka

- redis

### 配置

- config

```js
const config = {
  name: 'json', // 解码器名称，用于标记解码所需加载的规则标记 （json string Hex ..）
  topic: 'JSON_TOPIC', // 监听的topic，获取支持解码的数据
  redis: {
    // redis配置信息
    host: '192.168.0.201',
    port: 6379,
    db: 14
  },

  kafka: {
    // kafka配置信息
    kafkaHost: '192.168.10.120:6667,192.168.10.121:6667,192.168.10.122:6667'
  }
}
```

- 流程

![](https://image-1257148187.cos.ap-chengdu.myqcloud.com/picgo_img/20190131161528.png)

- 解码器规则实例

```
key-data-change-rule-5601808030001129

{
  "str": {
    "processorFn": "const arr = data.split(':'); return[{attr: arr[0],val:arr[1]}];"
  },
  "hex": {
    "framework": { // hex 偏移量规则 本例基于 modbus 协议制定
      "address": 2,
      "command":   2,
      "length":   2,
      "data": "*",
      "crc":   4
    },
    "data": "data", // 数据属性名
    "dataChangeFn": [ // 数据转换格式，位置参数
      "data = data + 'ms'; return{attr:'SSLL',val:data};",
      "data = data + 'ms'; return{attr:'LJLL',val:data};"
    ],
    "checkTag": "crc",
    "checkFn": {

    },
    // 解码规则 （基于 modbus 协议）
    "processorFn": "const count = data.length / 8;const dataItemList = [];let offset = 0;for (let i = 1; i <= count; i++){let subData = data.slice(offset, offset + 8);const h = subData.slice(0, 4);const l = subData.slice(4, 8);const data_bit = parseInt(l + h, 16).toString(2);const data_E = parseInt(data_bit.slice(0, 8), 2);const data_M = data_bit.slice(8, 64);let data_M_10 = 0.0;for (var j = 0; j < data_M.length; j++){data_M_10 = data_M_10 + data_M[j]* Math.pow(2, -1 * (j + 1));}const readData = Math.pow(2, data_E - 127) * (1 + data_M_10);dataItemList.push(readData);offset += 8;}return dataItemList;"
  },
  "json": {
    "processorFn": "const jsonStr = JSON.parse(data);const datas = jsonStr.data;return [{attr:'YL',val:datas[0].ch1}];"
  }
}
```

```
key-attr-topic-rule-5601808030001129

{
  "Signal": [
    "realtime-status-topic",
    "pgsql-topic"
  ],
  "SSLL": [
    "pgsql-topic"
  ],
  "LJLL": [
    "pgsql-topic"
  ],
  "YL": [
    "pgsql-topic"
  ]
}
```
