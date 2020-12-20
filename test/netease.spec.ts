/**
 * @file Test of NeteaseMusic Class
 * @author Surmon <https://github.com/surmon-china>
 */

import NeteaseMusic from '../src/netease'
const nm = new NeteaseMusic()

describe('测试网易云接口', () => {
  it('测试搜索接口', done => {
    nm.search('一人饮酒醉')
      .then(data => {
        expect(data).not.toBeUndefined()
        expect(data.result.songs[0].name).toContain('一人饮酒醉')
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('测试歌单', done => {
    nm.playlist('751387161')
      .then(data => {
        expect(data).not.toBeUndefined()
        expect(data.playlist.trackIds.length).toBe(19)
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('测试歌单接口容错', done => {
    nm._playlist('')
      .then(data => {
        expect(data).not.toBeUndefined()
        expect(data.code).toBe(400)
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('测试获取图片', done => {
    nm.picture('3388694837506899', 300)
      .then(data => {
        expect(data).not.toBeUndefined()
        expect(data.url.slice(11, data.url.length)).toBe('music.126.net/br3IrdCvT7-GjCyUVNONiA==/3388694837506899.jpg?param=300y300')
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('测试获取歌词', done => {
    nm.lyric('411356994')
      .then(data => {
        expect(data).not.toBeUndefined()
        expect(data.lrc.lyric).not.toBeUndefined()
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('测试歌词接口容错', done => {
    nm.lyric('')
      .then(() => void 0)
      .catch(error => {
        expect(error).toContain('failed')
        done()
      })
  })

  it('测试歌曲详情', done => {
    nm.song('411356994')
      .then(data => {
        expect(data).not.toBeUndefined()
        expect(data.songs[0].name).toBe('火葬场之歌')
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('测试多歌曲详情', done => {
    nm.song(['411356994', '1451220609'])
      .then(data => {
        expect(data).not.toBeUndefined()
        expect(data.songs[0].name).toBe('火葬场之歌')
        expect(data.songs[1].name).toBe('Babel')
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('测试获取唱片', done => {
    nm.album('35327877')
      .then(data => {
        expect(data).not.toBeUndefined()
        expect(data.album.blurPicUrl.slice(10, data.album.blurPicUrl.length)).toBe(`music.126.net/4mUKGD6wyIW0XpTWXiFcdQ==/19124905253588326.jpg`)
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('测试获取播放地址', done => {
    nm.url('33894312')
      .then(data => {
        expect(data).not.toBeUndefined()
        expect(data.data[0].id).toBe(33894312)
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('测试获取多歌曲播放地址', done => {
    nm.url(['33894312', '1451220609'])
      .then(data => {
        expect(data).not.toBeUndefined()
        expect(data.data[0].id).toBe(33894312)
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('测试获取歌手信息', done => {
    nm.artist('4130')
      .then(data => {
        expect(data).not.toBeUndefined()
        expect(data.code).toBe(200)
        expect(data.artist.name).toBe('李玉刚')
        done()
      })
      .catch(error => {
        done(error)
      })
  })
})
