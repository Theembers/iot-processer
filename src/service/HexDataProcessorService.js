class HexDataProcessorService {
  constructor(sourceData) {
    this.sourceData = sourceData
  }

  // 加载解码器规则
  loadProcessorRule(rule) {
    this.rule = rule
    return this
  }

  // 解码执行
  run() {
    if (!this.sourceData || !this.rule) {
      throw 'empty sourceData or rule.'
    }
    if (this.rule.framework) {
      // 计算 data标记的 属性值
      if (this.rule.framework[this.rule.data]) {
        this.rule.framework[this.rule.data] = getDataLength(
          this.sourceData.length,
          this.rule.data,
          this.rule.framework
        )
      }

      let offset = 0
      // 结构拆解
      const data = {}
      for (const f in this.rule.framework) {
        let v = this.rule.framework[f]
        data[f] = this.sourceData.slice(offset, offset + v)
        offset += v
      }
      // 转换
      if (!this.rule.data) {
        throw "undefined 'data'. "
      }
      if (this.rule.processorFn) {
        const func = new Function('data', this.rule.processorFn)
        this.data = func(data[this.rule.data])
      }

      if (this.rule.dataChangeFn) {
        for (const i in this.data) {
          const fu = new Function('data', this.rule.dataChangeFn[i])
          this.data[i] = fu(this.data[i])
        }
      }
    }
    return this
  }

  // 获取 结果
  getData() {
    return this.data
  }
}
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
function Str2Bytes(str) {
  var pos = 0
  var len = str.length
  if (len % 2 != 0) {
    return null
  }
  len /= 2
  var hexA = new Array()
  for (var i = 0; i < len; i++) {
    var s = str.substr(pos, 2)
    var v = parseInt(s, 16)
    hexA.push(v)
    pos += 2
  }
  return hexA
}
module.exports = HexDataProcessorService
