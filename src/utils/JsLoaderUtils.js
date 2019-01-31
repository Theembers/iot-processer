const RedisUtils = require('./RedisUtils')
const config = require('../config/config')

const redis = new RedisUtils()

class Processor {
  constructor(map) {
    this.profire_info = map
  }
  // 初始化 解析器
  init(profire_key) {
    return new Promise((resolve, reject) => {
      redis.get(profire_key).then(result => {
        this.profire_info = result
      })
    })
  }

  // 执行 解码
  run(sourceData) {
    // 获取规则
    const rules = this.profire_info[config.name]
    if (rules) {
      const data = {}
      if (rules.framework) {
        // 计算 data标记的 属性值
        if (rules.framework[rules.data]) {
          rules.framework[rules.data] = getDataLength(
            sourceData.length,
            rules.data,
            rules.framework
          )
        }

        let offset = 0
        // 结构拆解

        for (const f in rules.framework) {
          let v = rules.framework[f]
          data[f] = sourceData.slice(offset, offset + v)
          offset += v
        }
        // 转换
      }
      let datas = []
      if (rules.data) {
        // datas = test(data[rules.data])
        const func = new Function('data', funstr)
        datas = func(data[rules.data])
        // console.log(data[rules.data])
      }

      if (rules.dataChangeFn) {
        for (const i in datas) {
          const fu = new Function('data', rules.dataChangeFn[i])
          datas[i] = fu(datas[i])
        }
      }
      console.log(datas)
    }
  }
}

const funDemo = "data = data + 'ms'; return data;"

const funstr =
  'const count = data.length / 8;const dataItemList = [];let offset = 0;for (let i = 1; i <= count; i++) {let subData = data.slice(offset, offset + 8);const h = subData.slice(0, 4);const l = subData.slice(4, 8);const data_bit = parseInt(l + h, 16).toString(2);const data_E = parseInt(data_bit.slice(0, 8), 2);const data_M = data_bit.slice(8, 64);let data_M_10 = 0.0;for (var j = 0; j < data_M.length; j++) {data_M_10 = data_M_10 + data_M[j] * Math.pow(2, -1 * (j + 1));}const readData = Math.pow(2, data_E - 127) * (1 + data_M_10);dataItemList.push(readData);offset += 8;} return dataItemList;'
const profireMap = {
  hex: {
    framework: {
      address: 2,
      command: 2,
      length: 2,
      data: '*',
      crc: 4
    },
    data: 'data',
    dataChangeFn: [funDemo, funDemo],
    checkTag: 'crc',
    checkFn: {}
  },
  json: {
    framework: [],
    dataChangeFn: [],
    checkTag: '',
    checkFn: {}
  },
  str: {
    dataChangeFn: ''
  }
}

const source = '010308A5BB4348D2364A8AD5D7'
const p = new Processor(profireMap)
p.run(source)

function getDataLength(sourceLength, data, framework) {
  let otherLength = 0

  for (const f in framework) {
    let v = framework[f]
    if (f !== data) {
      otherLength += v
    }
  }
  return sourceLength - otherLength
}

function subData(data) {
  const count = data.length / 8
  const dataItemList = []
  let offset = 0
  for (let i = 1; i <= count; i++) {
    let subData = data.slice(offset, offset + 8)
    dataItemList.push(modbus(subData))
    offset += 8
  }
  return dataItemList
}

function modbus(data) {
  // 高地位转换
  const h = data.slice(0, 4)
  const l = data.slice(4, 8)

  const data_bit = parseInt(l + h, 16).toString(2)

  const data_E = parseInt(data_bit.slice(0, 8), 2)
  const data_M = data_bit.slice(8, 64)
  let data_M_10 = 0.0
  for (var j = 0; j < data_M.length; j++) {
    data_M_10 = data_M_10 + data_M[j] * Math.pow(2, -1 * (j + 1))
  }
  return Math.pow(2, data_E - 127) * (1 + data_M_10)
}

function test(data) {
  const count = data.length / 8
  const dataItemList = []
  let offset = 0
  for (let i = 1; i <= count; i++) {
    let subData = data.slice(offset, offset + 8)
    const h = subData.slice(0, 4)
    const l = subData.slice(4, 8)
    const data_bit = parseInt(l + h, 16).toString(2)
    const data_E = parseInt(data_bit.slice(0, 8), 2)
    const data_M = data_bit.slice(8, 64)
    let data_M_10 = 0.0
    for (var j = 0; j < data_M.length; j++) {
      data_M_10 = data_M_10 + data_M[j] * Math.pow(2, -1 * (j + 1))
    }
    const readData = Math.pow(2, data_E - 127) * (1 + data_M_10)
    dataItemList.push(readData)
    offset += 8
  }
  return dataItemList
}
