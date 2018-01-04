
const http = require('http')
const Buffer = require('buffer').Buffer  
const form = 'eparams=A0D9583F4C5FF68DE851D2893A49DE986BDC9600830840B64DD89587B2E6895CBEFEE7EF3896AC69F1BE2FE8253F983D7475D0CCC40A36775670A9DFB0A3C808C82206DAF46743B32B91BE74823CDF174A9FFAD1BBF7E39BFF0ED8FB615304EEAAA7A2001BF3B34AF32F6761D86D6966'
const options = {
    port: 80,
    path: '/api/v3/playlist/detail?id=751387161',
    method: 'POST',
    hostname: 'music.163.com',
    headers: {
        'referer': 'https://music.163.com/',
        // 'cookie': 'os=linux; appver=1.0.0.1026; osver=Ubuntu%2017.10; MUSIC_U=78d411095f4b022667bc8ec49e9a44cca088df057d987f5feaf066d37458e41c4a7d9447977352cf27ea9fee03f6ec4441049cea1c6bb9b6; __remember_me=true',
        'useragent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
    }
}

// options['headers']['Content-Type'] = 'application/x-www-form-urlencoded'
// options['headers']['Content-Length'] = Buffer.byteLength(form)

const req = http.request(options, res => {
    res.setEncoding('utf8')
    res.on('data', date => {
        console.log('date', date)
    })
    res.on('end',() => {
        console.log('结束了')
    })
})

req.on('error', err => {
    console.error(`problem with request: ${err.message}`)
})

// req.write(form)
req.end()

console.log(req)
