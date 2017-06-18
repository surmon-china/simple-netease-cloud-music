const http = require('http')
const crypto = require('crypto')
const querystring = require('querystring')
const Buffer = require('buffer').Buffer  
const pack = require('./pack')

// 私有方法
const neteaseAESECB = Symbol('neteaseAESECB')
const getHttpOption = Symbol('getHttpOption')
const makeRequest = Symbol('makeRequest')
const onResponse = Symbol('onResponse')

// 参数加密秘钥，不要改变 !!!
const secret = '7246674226682325323F5E6544673A51'

class Netease {

    constructor() {}

    /**
     * 根据关键词获取歌曲列表
     * 
     * @param {Integer} string 关键词
     * 
     * @return {Promise}
     */
    search(keyword, page = 1, limit = 3) {
        const body = {
            method: 'POST',
            params: {
                s: keyword,
                type: 1,
                limit: limit,
                total: true,
                offset: page - 1
            },
            url: 'http://music.163.com/api/cloudsearch/pc'
        }

        const form = this[neteaseAESECB](body)
        const options = this[getHttpOption]('POST', '/api/linux/forward', Buffer.byteLength(form))

        return this[makeRequest](options, form)
    }

    /**
     * 根据艺术家 id 获取艺术家信息
     * 
     * @param {Integer} string 艺术家 id
     * 
     * @return {Promise}
     */
    artist(id, limit = 50) {
        const body = {
            method: 'GET',
            params: {
                id,
                ext: true,
                top: limit
            },
            url: `http://music.163.com/api/v1/artist/${id}`
        }

        const form = this[neteaseAESECB](body)
        const options = this[getHttpOption]('POST', '/api/linux/forward', Buffer.byteLength(form))

        return this[makeRequest](options, form)
    }

    /**
     * 根据歌单 id 获取歌单信息和歌曲列表
     * 
     * @param {Integer} string 歌单 id
     * 
     * @return {Promise}
     */
    playlist(id) {
        const body = {
            method: 'POST',
            params: {
                id,
                n: 1000
            },
            url: 'http://music.163.com/api/v3/playlist/detail'
        }

        const form = this[neteaseAESECB](body)
        const options = this[getHttpOption]('POST', '/api/linux/forward', Buffer.byteLength(form))

        return this[makeRequest](options, form)
    }

    /**
     * 根据专辑 id 获取专辑信息及歌曲列表
     * 
     * @param {Integer} string 专辑 id
     * 
     * @return {Promise}
     */
    album(id) {
        const body = {
            method: 'GET',
            params: { id },
            url: `http://music.163.com/api/v1/album/${id}`
        }

        const form = this[neteaseAESECB](body)
        const options = this[getHttpOption]('POST', '/api/linux/forward', Buffer.byteLength(form))

        return this[makeRequest](options, form)
    }

    /**
     * 根据歌曲 id 获取歌曲信息
     * 
     * @param {Integer} string 歌曲 id
     * 
     * @return {Promise}
     */
    song(id) {
        const body = {
            method: 'POST',
            params: {
                c: `[{id: ${id}}]`
            },
            url: 'http://music.163.com/api/v3/song/detail'
        }

        const form = this[neteaseAESECB](body)
        const options = this[getHttpOption]('POST', '/api/linux/forward', Buffer.byteLength(form))

        return this[makeRequest](options, form)
    }

    /**
     * 根据歌曲 id 获取歌曲资源地址
     * 
     * @param {Integer} string 歌曲 id
     * 
     * @return {Promise}
     */
    url(id, br = 320) {
        const body = {
            method: 'POST',
            params: {
                ids: [id],
                br: br * 1000
            },
            url: 'http://music.163.com/api/song/enhance/player/url'
        }

        const form = this[neteaseAESECB](body)
        const options = this[getHttpOption]('POST', '/api/linux/forward', Buffer.byteLength(form))

        return this[makeRequest](options, form)
    }

    /**
     * 根据歌曲 id 获取歌词
     * 
     * @param {Integer} string 歌曲 id
     * 
     * @return {Object}
     */
    lyric(id) {
        const body = {
            method: 'POST',
            params: {
                id: id,
                os: 'linux',
                lv: -1,
                kv: -1,
                tv: -1,
            },
            url: 'http://music.163.com/api/song/lyric',
        }

        const form = this[neteaseAESECB](body)
        const options = this[getHttpOption]('POST', '/api/linux/forward', Buffer.byteLength(form))

        return this[makeRequest](options, form)
    }

    /**
     * 根据封面图片 id 获取图片地址
     * 
     * @param {Integer} string 图片 id
     * 
     * @return {Object}
     */
    picture(id, size = 300) {

        const md5 = data => {  
            const buf = new Buffer(data)
            const str = buf.toString('binary')
            return crypto.createHash("md5").update(str).digest('hex')  
        }

        const netease_pickey = id => {
            const magic = '3go8&$8*3*3h0k(2)2'.split('')
            const song_id = id.split('').map((item, index) => {
                return String.fromCharCode(item.charCodeAt() ^ (magic[index % magic.length]).charCodeAt())
            })
            const md5Code = md5(song_id.join(''))
            const base64Code = Buffer.from(md5Code, 'hex').toString('base64')
            return base64Code.replace('/', '_').replace('+', '-')
        }

        return new Promise((resolve, reject) => resolve({
            url: `https://p3.music.126.net/${netease_pickey(id)}/${id}.jpg?param=${size}y${size}`
        }))
    }

    /**
     * 私有方法，加密
     * 
     * @param {Object} body 表单数据
     * 
     * @return {String} 加密后的表单数据
     */
    [neteaseAESECB](body) {
        body = JSON.stringify(body)
        const password = pack('H*', secret)
        const cipher = crypto.createCipheriv('aes-128-ecb', password, '')
        body = cipher.update(body, 'utf8', 'base64') + cipher.final('base64')
        const hex = new Buffer(body, 'base64').toString('hex')
        const form = querystring.stringify({
            eparams: hex.toUpperCase()
        })
        return form
    }

    /**
     * 获取请求选项
     * 
     * @param {String} method GET | POST
     * @param {String} path http 请求路径
     * @param {Integer} contentLength 如何是 POST 请求，参数长度
     * 
     * @return Object
     */
    [getHttpOption](method, path, contentLength) {
        const options = {
            port: 80,
            path: path,
            method: method,
            hostname: 'music.163.com',
            headers: {
                'referer': 'https://music.163.com/',
                'cookie': 'os=linux; appver=1.0.0.1026; osver=Ubuntu%2016.10; MUSIC_U=78d411095f4b022667bc8ec49e9a44cca088df057d987f5feaf066d37458e41c4a7d9447977352cf27ea9fee03f6ec4441049cea1c6bb9b6; __remember_me=true',
                'useragent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
            }
        }

        if ('POST' === method) {
            options['headers']['Content-Type'] = 'application/x-www-form-urlencoded'
            options['headers']['Content-Length'] = contentLength
        }

        return options
    }

    /**
     * 发送请求
     * 
     * @param {Object} options 请求选项
     * @param {String} form 表单数据
     * 
     * @return Promise
     */
    [makeRequest](options, form) {
        return new Promise((resolve, reject) => {
            const req = http.request(options, res => {
                res.setEncoding('utf8')
                this[onResponse](res, resolve, reject)
            })

            req.on('error', err => {
                console.error(`problem with request: ${err.message}`)
            })

            // write data to request body
            req.write(form)
            req.end()
        })
    }

    /**
     * 响应处理
     * 
     * @param {http.ServerResponse} response 
     * @param {Promise.resolve} resolve 
     * @param {Promise.reject} reject 
     */
    [onResponse](response, resolve, reject) {

        const hasResponseFailed = response.status >= 400
        let responseBody = ''

        if (hasResponseFailed) {
            reject(`Request to ${response.url} failed with HTTP ${response.status}`)
        }

        /* the response stream's (an instance of Stream) current data. See:
         * https://nodejs.org/api/stream.html#stream_event_data */
        response.on('data', chunk => responseBody += chunk.toString())

        // once all the data has been read, resolve the Promise 
        response.on('end', () => resolve(JSON.parse(responseBody)))
    }
}

module.exports = Netease
