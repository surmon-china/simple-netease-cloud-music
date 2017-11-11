const Netease = require('./netease.js')
const netease = new Netease()

netease.search('一人饮酒醉').then(data => {
    console.log('歌曲搜索', data)
})

netease.playlist('751387161').then(data => {
    console.log('歌单1', data)
})

netease._playlist('751387161').then(data => {
    console.log('歌单2', data)
})

netease.picture('19124905253588326', 400).then(data => {
    console.log('图片地址', data)
})

netease.artist('4130').then(data => {
    console.log('艺术家', data)
})

netease.album('35327877').then(data => {
    console.log('唱片', data)
})

netease.lyric('479403027').then(data => {
    console.log('歌词', data)
})

netease.url('479403027').then(data => {
    console.log('歌曲地址', data)
})

netease.song('479403027').then(data => {
    console.log('歌曲详情', data)
})
