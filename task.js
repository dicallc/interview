// task.js
let fs = require('fs')
let path = require('path')
let endOfLine = require('os').EOL

module.exports = {
  maxHistoryNum: 5,
  historyFile: path.resolve(__dirname, './dist/history.js'),
  staticDir: path.resolve(__dirname, './dist/'),

  creataHistoryIfNotExist () {
    if (!fs.existsSync(this.historyFile)) {
      this.storeHistory([], 'a+')
    }
  },

  // @done 将数据写到 history.js
  storeHistory (list, mode) {
    let historyFile = this.historyFile
    let outJson = 'module.exports = [' + endOfLine
    let listLen = list.length
    if (list && listLen > 0) {
      list.forEach((item, index) => {
        if (index === listLen - 1) {
          outJson += `  ${item}${endOfLine}`
        } else {
          outJson += `  ${item},${endOfLine}`
        }
      })
    }
    outJson += ']' + endOfLine

    fs.writeFileSync(historyFile, outJson, {
      flag: mode
    })
  },

  // 递归删除目录中的文件
  rmFiles (dirPath, regexp) {
    let files
    try {
      files = fs.readdirSync(dirPath)
    } catch (e) {
      return
    }
    if (regexp && files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        let filename = files[i]
        let filePath = dirPath + '/' + files[i]
        if (fs.statSync(filePath).isFile() && regexp.test(filename)) {
          console.log('删除过期的历史版本->(' + regexp + ')：' + filename)
          fs.unlinkSync(filePath)
        } else {
          this.rmFiles(filePath, regexp)
        }
      }
    }
  },

  // @done
  cleanOldVersionFilesIfNeed (version) {
    let staticDir = this.staticDir
    let maxHistoryNum = this.maxHistoryNum

    let history = []

    try {
      history = require(this.historyFile)
    } catch (e) {
      console.log(e)
    }

    // 加入最新的版本，老的的版本删除
    history.push(version)

    // 如果历史版本数超过限制，则删除老的历史版本
    let len = history.length
    if (len > maxHistoryNum) {
      let oldVersions = history.slice(0, len - maxHistoryNum)

      for (let i = 0; i < oldVersions.length; i++) {
        let ver = oldVersions[i]
        let reg = new RegExp(ver)
        this.rmFiles(staticDir, reg)
      }

      // 更新history文件
      let newVersions = history.slice(len - maxHistoryNum)
      this.storeHistory(newVersions)
    } else {
      // 写入history文件
      this.storeHistory(history)
    }
  },

  // 入口
  run (version) {
    this.creataHistoryIfNotExist()
    this.cleanOldVersionFilesIfNeed(version)
  }
}
