# simple-netease-cloud-music

[![GitHub stars](https://img.shields.io/github/stars/surmon-china/simple-netease-cloud-music.svg?style=for-the-badge)](https://github.com/surmon-china/simple-netease-cloud-music/stargazers)
[![npm](https://img.shields.io/npm/v/simple-netease-cloud-music?color=%23c7343a&label=npm&style=for-the-badge)](https://www.npmjs.com/package/simple-netease-cloud-music)
[![GitHub issues](https://img.shields.io/github/issues-raw/surmon-china/simple-netease-cloud-music.svg?style=for-the-badge)](https://github.com/surmon-china/simple-netease-cloud-music/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/surmon-china/simple-netease-cloud-music.svg?style=for-the-badge)](https://github.com/surmon-china/simple-netease-cloud-music)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=for-the-badge)](https://github.com/surmon-china/simple-netease-cloud-music/blob/master/LICENSE)


[![NPM](https://nodei.co/npm/simple-netease-cloud-music.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/simple-netease-cloud-music/)

### 能做什么

简单、统一、轻巧的 Node.js 版网易云音乐 API。

- 简单：**8个常用接口**
- 统一：**标准 Promise API**
- 轻巧：**不依赖任何第三方库**

### 贡献者

核心逻辑的实现参考 PHP 版本的 [Meting](https://github.com/metowolf/Meting) 项目。

核心的 API 类的逻辑来自于 [张小张同学](https://github.com/ritayzy)。

### 最新更新

若 API `playlist` 数据出现异常，可暂时使用 API `_playlist`

### 怎么用

```bash
npm i simple-netease-cloud-music --save
```

```javascript
const NeteaseMusic = require('simple-netease-cloud-music')
const nm = new NeteaseMusic()

// 当然，你也可以通过以下方式来定义模块使用的 cookie
const nm = new NeteaseMusic({
    cookie: '__Your_Cookies__'
})

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

### 测试开发

```bash
yarn dev
yarn lint
yarn test
yarn build
```

