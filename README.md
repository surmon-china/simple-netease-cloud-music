### 能做什么

简单、统一、轻巧的 Node.js 版网易云音乐 API。

- 简单：8个常用接口
- 统一：标准 Promise API
- 轻巧：不依赖任何第三方库

### 贡献者

核心逻辑的实现参考 PHP 版本的 [Meting](https://github.com/metowolf/Meting) 项目。

核心的 API 类的逻辑来自于 [张小张同学](https://github.com/ritayzy)。

### 怎么用

```bash
npm i simple-netease-cloud-music --save
```

```javascript
const NeteaseMusic = require('simple-netease-cloud-music')
const nm = new NeteaseMusic()

nm.search('一人饮酒醉').then(data => {
    console.log('歌曲搜索', data)
})

nm.playlist('751387161').then(data => {
    console.log('歌单', data)
})

nm.picture('19124905253588326', 400).then(data => {
    console.log('图片地址', data)
})

nm.artist('4130').then(data => {
    console.log('艺术家', data)
})

nm.album('35327877').then(data => {
    console.log('歌单', data)
})

nm.lyric('479403027').then(data => {
    console.log('歌词', data)
})

nm.url('479403027').then(data => {
    console.log('歌曲地址', data)
})

nm.song('479403027').then(data => {
    console.log('歌曲详情', data)
})
```

### Test

```
node example.js
```
