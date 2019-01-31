class StringDataProcessorService {
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
      console.log(this.sourceData, this.rule)
      throw 'empty sourceData or rule.'
    }
    this.sourceData = hex2str(this.sourceData)
    if (this.rule.processorFn) {
      const fu = new Function('data', this.rule.processorFn)
      this.data = fu(this.sourceData)
    } else {
      this.data = this.sourceData
    }
    if (this.rule.dataChangeFn) {
      for (const i in this.data) {
        const fu = new Function('data', this.rule.dataChangeFn[i])
        this.data[i] = fu(this.data[i])
      }
    }
    return this
  }

  // 获取 结果
  getData() {
    return this.data
  }
}

// str: { dataChangeFn:'' }

module.exports = StringDataProcessorService

function hex2str(hex) {
  var trimedStr = hex.trim()
  var rawStr =
    trimedStr.substr(0, 2).toLowerCase() === '0x'
      ? trimedStr.substr(2)
      : trimedStr
  var len = rawStr.length
  if (len % 2 !== 0) {
    return ''
  }
  var curCharCode
  var resultStr = []
  for (var i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16)
    resultStr.push(String.fromCharCode(curCharCode))
  }
  return resultStr.join('').trim()
}
