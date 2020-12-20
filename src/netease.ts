/**
 * @file NeteaseMusic Class
 * @author Surmon <https://github.com/surmon-china>
 */

import http from 'http'
import crypto from 'crypto'
import querystring from 'querystring'

const randomUserAgent = (): string => {
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

const randomCookies = (musicU: string): string => {
  const CookiesList = [
    'os=pc; osver=Microsoft-Windows-10-Professional-build-10586-64bit; appver=2.0.3.131777; channel=netease; __remember_me=true',
    'MUSIC_U=' + musicU + '; buildver=1506310743; resolution=1920x1080; mobilename=MI5; osver=7.0.1; channel=coolapk; os=android; appver=4.2.0',
    'osver=%E7%89%88%E6%9C%AC%2010.13.3%EF%BC%88%E7%89%88%E5%8F%B7%2017D47%EF%BC%89; os=osx; appver=1.5.9; MUSIC_U=' + musicU + '; channel=netease;'
  ]
  const num = Math.floor(Math.random() * CookiesList.length)
  return CookiesList[num]
}

type songId = string
interface NeteaseMusicOption {
  cookie?: string;
}

// DONT CHANGE!!
const SECRET = '7246674226682325323F5E6544673A51'

// private functions
const neteaseAESECB = Symbol('neteaseAESECB')
const getHttpOption = Symbol('getHttpOption')
const getRandomHex = Symbol('getRandomHex')
const makeRequest = Symbol('makeRequest')

export default class NeteaseMusic {

  private cookie = ''

  constructor(options: NeteaseMusicOption = {}) {
    if (options.cookie) {
      this.cookie = options.cookie
    }
  }

  /**
   * 私有方法，加密
   * @param {Object} body 表单数据
   * @return {String} 加密后的表单数据
   */
  private [neteaseAESECB](body: http.RequestOptions): string {
    const password = Buffer.from(SECRET, 'hex').toString('utf8');
    const cipher = crypto.createCipheriv('aes-128-ecb', password, '')
    const hex = cipher.update(JSON.stringify(body), 'utf8', 'hex') + cipher.final('hex')
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
  private [getHttpOption](method: string, path: string, contentLength?: number): http.RequestOptions {
    const options = {
      port: 80,
      path,
      method,
      hostname: 'music.163.com',
      headers: {
        'referer': 'https://music.163.com/',
        'cookie': this.cookie || randomCookies(this[getRandomHex](128)),
        'user-agent': randomUserAgent()
      } as http.OutgoingHttpHeaders
    }

    if ('POST' === method) {
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded'

      if (contentLength) {
        options.headers['Content-Length'] = contentLength
      }
    }

    return options
  }

  /**
   * 获取随机字符串
   * @param {Integer} length 生成字符串的长度
   */
  private [getRandomHex](length: number): string {
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
  private [makeRequest](options: http.RequestOptions, form?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = http.request(options, response => {
        response.setEncoding('utf8')

        let responseBody = ''
        const hasResponseFailed = response.statusCode && response.statusCode >= 400

        if (hasResponseFailed) {
          reject(`Request to ${response.url} failed with HTTP ${response.statusCode}`)
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
      })

      request.on('error', err => {
        console.error(`problem with request: ${err.message}`)
      })

      // write data to request body
      if (form) {
        request.write(form)
      }
      request.end()
    })
  }

  /**
   * 根据关键词获取歌曲列表
   * @param {Integer} string 关键词
   * @return {Promise}
   */
  search(keyword?: string, page = 1, limit = 3) {
    const body = {
      method: 'POST',
      params: {
        s: keyword,
        type: 1,
        limit,
        total: true,
        offset: page - 1
      },
      url: 'https://music.163.com/api/cloudsearch/pc'
    }

    const form = this[neteaseAESECB](body)
    const options = this[getHttpOption](
      'POST',
      '/api/linux/forward',
      Buffer.byteLength(form)
    )

    return this[makeRequest](options, form)
  }

  /**
   * 根据艺术家 id 获取艺术家信息
   * @param {Integer} string 艺术家 id
   * @return {Promise}
   */
  artist(id: songId, limit = 50) {
    const body = {
      method: 'GET',
      params: {
        id,
        ext: true,
        top: limit
      },
      url: `https://music.163.com/api/v1/artist/${id}`
    }

    const form = this[neteaseAESECB](body)
    const options = this[getHttpOption](
      'POST',
      '/api/linux/forward',
      Buffer.byteLength(form)
    )

    return this[makeRequest](options, form)
  }

  /**
   * Get playlist by playlist ID
   * @param {Integer} string 歌单 id
   * @return {Promise}
   */
  playlist(id: songId, limit = 1000) {
    const body = {
      method: 'POST',
      params: {
        id,
        n: limit
      },
      url: 'https://music.163.com/api/v3/playlist/detail'
    }

    const form = this[neteaseAESECB](body)
    const options = this[getHttpOption](
      'POST',
      '/api/linux/forward',
      Buffer.byteLength(form)
    )

    return this[makeRequest](options, form)
  }

  /**
   * HACK: Get playlist by playlist ID
   * @param {Integer} string 歌单 id
   * @return {Promise}
   */
  _playlist(id: songId, limit = 1000) {
    const body = {
      method: 'POST',
      params: {
        id,
        n: limit
      },
      url: '/api/v2/playlist/detail'
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
  album(id: songId) {
    const body = {
      method: 'GET',
      params: { id },
      url: `https://music.163.com/api/v1/album/${id}`
    }

    const form = this[neteaseAESECB](body)
    const options = this[getHttpOption](
      'POST',
      '/api/linux/forward',
      Buffer.byteLength(form)
    )

    return this[makeRequest](options, form)
  }

  /**
   * 根据歌曲 id 获取歌曲信息
   * @param {Integer} string 歌曲 id
   * @return {Promise}
   */
  song(id: songId | songId[]) {
    const ids = Array.isArray(id) ? id : [id]
    const body = {
      method: 'POST',
      params: {
        c: `[${ids.map(_id => `{id: ${_id}}`).join(',')}]`,
      },
      url: 'https://music.163.com/api/v3/song/detail'
    }

    const form = this[neteaseAESECB](body)
    const options = this[getHttpOption](
      'POST',
      '/api/linux/forward',
      Buffer.byteLength(form)
    )

    return this[makeRequest](options, form)
  }

  /**
   * 根据歌曲 id 获取歌曲资源地址
   * @param {Integer} string 歌曲 id
   * @return {Promise}
   */
  url(id: songId | songId[], br = 320) {
    const body = {
      method: 'POST',
      params: {
        ids: Array.isArray(id) ? id : [id],
        br: br * 1000
      },
      url: 'https://music.163.com/api/song/enhance/player/url'
    }

    const form = this[neteaseAESECB](body)
    const options = this[getHttpOption](
      'POST',
      '/api/linux/forward',
      Buffer.byteLength(form)
    )

    return this[makeRequest](options, form)
  }

  /**
   * 根据歌曲 id 获取歌词
   * @param {Integer} string 歌曲 id
   * @return {Object}
   */
  lyric(id: songId) {
    const body = {
      method: 'POST',
      params: {
        id,
        os: 'linux',
        lv: -1,
        kv: -1,
        tv: -1,
      },
      url: 'https://music.163.com/api/song/lyric',
    }

    const form = this[neteaseAESECB](body)
    const options = this[getHttpOption](
      'POST',
      '/api/linux/forward',
      Buffer.byteLength(form)
    )

    return this[makeRequest](options, form)
  }

  /**
   * 根据封面图片 id 获取图片地址
   * @param {Integer} string 图片 id
   * @return {Object}
   */
  picture(id: songId, size = 300) {

    const md5 = (data: string): string => {
      const buf = Buffer.from(data)
      const str = buf.toString('binary')
      return crypto.createHash('md5').update(str).digest('base64')
    }

    const neteasePickey = (id: songId): string => {
      id = String(id)
      const magic = '3go8&$8*3*3h0k(2)2'.split('')
      const songId = id
        .split('')
        .map((item, index) => String.fromCharCode(
          item.charCodeAt(0) ^ (magic[index % magic.length]).charCodeAt(0)
        ))
      return md5(songId.join(''))
        .replace(/\//g, '_')
        .replace(/\+/g, '-')
    }

    return Promise.resolve({
      url: `https://p3.music.126.net/${neteasePickey(id)}/${id}.jpg?param=${size}y${size}`
    })
  }
}
