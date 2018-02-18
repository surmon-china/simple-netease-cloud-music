// Mocha Test
const netease = require('../src/netease')
const expect = require('chai').expect
const nm = new netease('MUSIC_U=55c961cd063c81f50dd18e6e409f8392c7665c765a9c0233d78fcae6a30c893cf738edf12ac13f7a88c56137f5cdaae0374ec501422a03d2bf122d59fa1ed6a2; buildver=1506310743; resolution=1920x1080; mobilename=MI5; osver=7.0.1; channel=coolapk; os=android; appver=4.2.0');
describe('测试网易云接口', () => {
  it('测试搜索接口', function (done) {
    nm.search('一人饮酒独醉')
      .then(data => {
        expect(data).not.to.be.empty
        expect(data.result.songs[0].name).to.equal('一人饮酒醉')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('测试歌单1', function(done) {
    nm.playlist('751387161')
      .then(data => {
        expect(data).not.to.be.empty
        expect(data.playlist.trackIds.length).to.be.equal(25)
        done()
      })
      .catch(e => {
        done(e)
      })
  })

  it('测试歌单2', function(done) {
    nm._playlist('751387161')
      .then(data => {
        expect(data).not.to.be.empty
        expect(data.playlist.trackIds.length).to.be.equal(25)
        done()
      })
      .catch(e => {
        done(e)
      })
  })

  it('测试获取图片', function(done) {
    nm.picture('3388694837506899', 300)
      .then(data => {
        expect(data).not.to.be.empty
        expect(data.url).to.be.equal('https://p3.music.126.net/br3IrdCvT7-GjCyUVNONiA==/3388694837506899.jpg?param=300y300')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('测试获取歌词', function(done) {
    nm.lyric('418603133')
      .then(data => {
        expect(data).not.to.be.empty
        expect(data.lrc.lyric).not.to.be.empty
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('测试歌曲详情', function(done) {
    nm.song('418603133')
      .then(data => {
        expect(data).not.to.be.empty
        expect(data.songs[0].name).to.be.equal('Hello (W&W & Kenneth G Bootleg)')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('测试获取唱片', function(done) {
    nm.album('35327877')
      .then(data => {
        expect(data).not.to.be.empty
        expect(data.album.blurPicUrl).to.be.equal(`http://p1.music.126.net/4mUKGD6wyIW0XpTWXiFcdQ==/19124905253588326.jpg`)
        done()
      })
      .catch(e => {
        done(e)
      })
  })

  it('测试获取播放地址', function(done) {
    nm.url('33894312')
      .then(data => {
        expect(data).not.to.be.empty
        expect(data.data[0].id).to.be.equal(33894312)
        done()
      })
      .catch(e => {
        done(e)
      })
  })

  it('测试获取歌手信息', function(done) {
    nm.artist('4130')
      .then(data => {
        expect(data).not.to.be.empty
        expect(data.code).to.be.equal(200)
        expect(data.artist.name).to.be.equal('李玉刚')
        done()
      })
      .catch(e => {
        done(e)
      })
  })
  
})
