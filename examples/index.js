const Netease = require('../dist/netease.js')
const netease = new Netease()

const errorLogs = []
const successLogs = []

function printLog() {
  if ((errorLogs.length + successLogs.length) >= 9) {
    console.log('成功：' + successLogs.length + '!', successLogs)
    console.log('失败：' + errorLogs.length + '!', errorLogs)
  }
}

function consolelog(log) {
  console.log(log)
  printLog()
}

function consolewarn(log) {
  console.warn(log)
  printLog()
}

netease.search('一人饮酒醉').then(data => {
  successLogs.push({ name: '歌曲搜索', data })
  consolelog('歌曲搜索成功')
}).catch(error => {
  errorLogs.push({ name: '歌曲搜索', error })
  consolewarn('歌曲地址', error)
})

netease.playlist('751387161').then(data => {
  successLogs.push({ name: '歌单1', data })
  consolelog('歌单1成功')
}).catch(error => {
  errorLogs.push({ name: '歌单1', error })
  consolewarn('歌曲地址', error)
})

netease._playlist('751387161').then(data => {
  successLogs.push({ name: '歌单2', data })
  consolelog('歌单2成功')
}).catch(error => {
  errorLogs.push({ name: '歌单2', error })
  consolewarn('歌曲地址', error)
})

netease.picture('19124905253588326', 400).then(data => {
  successLogs.push({ name: '图片地址', data })
  consolelog('图片地址成功')
}).catch(error => {
  errorLogs.push({ name: '图片地址', error })
  consolewarn('歌曲地址', error)
})

netease.artist('4130').then(data => {
  successLogs.push({ name: '艺术家', data })
  consolelog('艺术家成功')
}).catch(error => {
  errorLogs.push({ name: '艺术家', error })
  consolewarn('歌曲地址', error)
})

netease.album('35327877').then(data => {
  successLogs.push({ name: '唱片', data })
  consolelog('唱片成功')
}).catch(error => {
  errorLogs.push({ name: '唱片', error })
  consolewarn('歌曲地址', error)
})

netease.lyric('411356994').then(data => {
  successLogs.push({ name: '歌词', data })
  consolelog('歌词成功')
}).catch(error => {
  errorLogs.push({ name: '歌词', error })
  consolewarn('歌曲地址', error)
})

netease.url('405253742').then(data => {
  successLogs.push({ name: '歌曲地址', data })
  consolelog('歌曲地址成功')
}).catch(error => {
  errorLogs.push({ name: '歌曲地址', error })
  consolewarn('歌曲地址', error)
})

netease.song('411356994').then(data => {
  successLogs.push({ name: '歌曲详情', data })
  consolelog('歌曲详情成功')
}).catch(error => {
  errorLogs.push({ name: '歌曲详情', error })
  consolewarn('歌曲地址', error)
})
