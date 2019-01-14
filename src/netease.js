/*
 * @file Main of simple-netease-cloud-music
 * @author Surmon <https://github.com/surmon-china>
 */

const http = require('http')
const crypto = require('crypto')
const querystring = require('querystring')

// 私有方法
const neteaseAESECB = Symbol('neteaseAESECB')
const getHttpOption = Symbol('getHttpOption')
const getRandomHex = Symbol('getRandomHex')
const makeRequest = Symbol('makeRequest')
const onResponse = Symbol('onResponse')

// 参数加密秘钥，不要改变 !!!
const secret = '7246674226682325323F5E6544673A51'

// Function
function randomUserAgent() {
    const userAgentList = [
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
        "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89;GameHelper",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:46.0) Gecko/20100101 Firefox/46.0",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:46.0) Gecko/20100101 Firefox/46.0",
        "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)",
        "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)",
        "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)",
        "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)",
        "Mozilla/5.0 (Windows NT 6.3; Win64, x64; Trident/7.0; rv:11.0) like Gecko",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586",
        "Mozilla/5.0 (iPad; CPU OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1"
    ]
    const num = Math.floor(Math.random() * userAgentList.length)
    return userAgentList[num]
}

function randomCookies(music_u) {
    const CookiesList = [
        'os=pc; osver=Microsoft-Windows-10-Professional-build-10586-64bit; appver=2.0.3.131777; channel=netease; __remember_me=true',
        'MUSIC_U=' + music_u +'; buildver=1506310743; resolution=1920x1080; mobilename=MI5; osver=7.0.1; channel=coolapk; os=android; appver=4.2.0',
        'osver=%E7%89%88%E6%9C%AC%2010.13.3%EF%BC%88%E7%89%88%E5%8F%B7%2017D47%EF%BC%89; os=osx; appver=1.5.9; MUSIC_U=' + music_u + '; channel=netease;'
    ]
    const num = Math.floor(Math.random() * CookiesList.length)
    return CookiesList[num]
}


class NeteaseMusic {

    constructor(options = {}) {
        if (options.cookie) {
            this.cookie = options.cookie
        }
        return this
    }
    
    /**
     * 根据关键词获取歌曲列表
     * @param {Integer} string 关键词
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
     * @param {Integer} string 艺术家 id
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
     * @param {Integer} string 歌单 id
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
     * 根据歌单 id 获取歌单信息和歌曲列表 !!!临时替代方案
     * @param {Integer} string 歌单 id
     * @return {Promise}
     */
    _playlist(id) {
        const body = {
            method: 'POST',
            params: {
                id,
                n: 1000
            },
            url: '/api/v3/playlist/detail'
        }

        body.url += '?' + querystring.stringify(body.params)
        const options = this[getHttpOption](body.method, body.url)

        return this[makeRequest](options)
    }

    /**
     * 根据专辑 id 获取专辑信息及歌曲列表
     * @param {Integer} string 专辑 id
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
     * @param {Integer} string 歌曲 id
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
     * @param {Integer} string 歌曲 id
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
     * @param {Integer} string 歌曲 id
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
     * @param {Integer} string 图片 id
     * @return {Object}
     */
    picture(id, size = 300) {

        const md5 = data => {  
            const buf = Buffer.from(data)
            const str = buf.toString('binary')
            return crypto.createHash('md5').update(str).digest('base64')
        }

        const netease_pickey = id => {
            const magic = '3go8&$8*3*3h0k(2)2'.split('')
            const song_id = id.split('').map((item, index) => {
                return String.fromCharCode(item.charCodeAt() ^ (magic[index % magic.length]).charCodeAt())
            })
            const md5Code = md5(song_id.join(''))
            return md5Code.replace(/\//g, '_').replace(/\+/g, '-')
        }

        return new Promise((resolve, reject) => resolve({
            url: `https://p3.music.126.net/${netease_pickey(id)}/${id}.jpg?param=${size}y${size}`
        }))
    }

    /**
     * 私有方法，加密
     * @param {Object} body 表单数据
     * @return {String} 加密后的表单数据
     */
    [neteaseAESECB](body) {
        body = JSON.stringify(body)
        const password = Buffer.from(secret, 'hex').toString('utf8');
        const cipher = crypto.createCipheriv('aes-128-ecb', password, '')
        const hex = cipher.update(body, 'utf8', 'hex') + cipher.final('hex')
        const form = querystring.stringify({
            eparams: hex.toUpperCase()
        })
        return form
    }

    /**
     * 获取请求选项
     * @param {String} method GET | POST
     * @param {String} path http 请求路径
     * @param {Integer} contentLength 如何是 POST 请求，参数长度
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
                'cookie': this.cookie || randomCookies(this[getRandomHex](128)),
                'user-agent': randomUserAgent()
            }
        }

        if ('POST' === method) {
            options['headers']['Content-Type'] = 'application/x-www-form-urlencoded'
            if (contentLength) {
                options['headers']['Content-Length'] = contentLength
            }
        }

        return options
    }

    /**
     * 获取随机字符串
     * @param {Integer} length 生成字符串的长度
     */
    [getRandomHex](length) {
        const isOdd = length % 2;
        const randHex = crypto.randomFillSync(Buffer.alloc((length + isOdd) / 2)).toString('hex')
        return isOdd ? randHex.slice(1) : randHex;
    }

    /**
     * 发送请求
     * @param {Object} options 请求选项
     * @param {String} form 表单数据
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
            if (form) {
                req.write(form)
            }
            req.end()
        })
    }

    /**
     * 响应处理
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
        response.on('end', () => {
            if (!responseBody) {
                return reject('remote result empty')
            }
            try {
                return resolve(JSON.parse(responseBody));
            } catch (error) {
                return resolve(responseBody);
            }
        })
    }
}

module.exports = NeteaseMusic
