'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var http = require('http');
var crypto = require('crypto');
var querystring = require('querystring');

var neteaseAESECB = Symbol('neteaseAESECB');
var getHttpOption = Symbol('getHttpOption');
var getRandomHex = Symbol('getRandomHex');
var makeRequest = Symbol('makeRequest');
var onResponse = Symbol('onResponse');

var secret = '7246674226682325323F5E6544673A51';

function randomUserAgent() {
    var userAgentList = ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36", "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1", "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1", "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36", "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36", "Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36", "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89;GameHelper", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4", "Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:46.0) Gecko/20100101 Firefox/46.0", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:46.0) Gecko/20100101 Firefox/46.0", "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)", "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)", "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)", "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)", "Mozilla/5.0 (Windows NT 6.3; Win64, x64; Trident/7.0; rv:11.0) like Gecko", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586", "Mozilla/5.0 (iPad; CPU OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1"];
    var num = Math.floor(Math.random() * userAgentList.length);
    return userAgentList[num];
}

function randomCookies(music_u) {
    var CookiesList = ['os=pc; osver=Microsoft-Windows-10-Professional-build-10586-64bit; appver=2.0.3.131777; channel=netease; __remember_me=true', 'MUSIC_U=' + music_u + '; buildver=1506310743; resolution=1920x1080; mobilename=MI5; osver=7.0.1; channel=coolapk; os=android; appver=4.2.0', 'osver=%E7%89%88%E6%9C%AC%2010.13.3%EF%BC%88%E7%89%88%E5%8F%B7%2017D47%EF%BC%89; os=osx; appver=1.5.9; MUSIC_U=' + music_u + '; channel=netease;'];
    var num = Math.floor(Math.random() * CookiesList.length);
    return CookiesList[num];
}

var NeteaseMusic = function () {
    function NeteaseMusic() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, NeteaseMusic);

        if (options.cookie) {
            this.cookie = options.cookie;
        }
        return this;
    }

    _createClass(NeteaseMusic, [{
        key: 'search',
        value: function search(keyword) {
            var page = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
            var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;

            var body = {
                method: 'POST',
                params: {
                    s: keyword,
                    type: 1,
                    limit: limit,
                    total: true,
                    offset: page - 1
                },
                url: 'http://music.163.com/api/cloudsearch/pc'
            };

            var form = this[neteaseAESECB](body);
            var options = this[getHttpOption]('POST', '/api/linux/forward', Buffer.byteLength(form));

            return this[makeRequest](options, form);
        }
    }, {
        key: 'artist',
        value: function artist(id) {
            var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;

            var body = {
                method: 'GET',
                params: {
                    id: id,
                    ext: true,
                    top: limit
                },
                url: 'http://music.163.com/api/v1/artist/' + id
            };

            var form = this[neteaseAESECB](body);
            var options = this[getHttpOption]('POST', '/api/linux/forward', Buffer.byteLength(form));

            return this[makeRequest](options, form);
        }
    }, {
        key: 'playlist',
        value: function playlist(id) {
            var body = {
                method: 'POST',
                params: {
                    id: id,
                    n: 1000
                },
                url: 'http://music.163.com/api/v3/playlist/detail'
            };

            var form = this[neteaseAESECB](body);
            var options = this[getHttpOption]('POST', '/api/linux/forward', Buffer.byteLength(form));

            return this[makeRequest](options, form);
        }
    }, {
        key: '_playlist',
        value: function _playlist(id) {
            var body = {
                method: 'POST',
                params: {
                    id: id,
                    n: 1000
                },
                url: '/api/v3/playlist/detail'
            };

            body.url += '?' + querystring.stringify(body.params);
            var options = this[getHttpOption](body.method, body.url);

            return this[makeRequest](options);
        }
    }, {
        key: 'album',
        value: function album(id) {
            var body = {
                method: 'GET',
                params: { id: id },
                url: 'http://music.163.com/api/v1/album/' + id
            };

            var form = this[neteaseAESECB](body);
            var options = this[getHttpOption]('POST', '/api/linux/forward', Buffer.byteLength(form));

            return this[makeRequest](options, form);
        }
    }, {
        key: 'song',
        value: function song(id) {
            var body = {
                method: 'POST',
                params: {
                    c: '[{id: ' + id + '}]'
                },
                url: 'http://music.163.com/api/v3/song/detail'
            };

            var form = this[neteaseAESECB](body);
            var options = this[getHttpOption]('POST', '/api/linux/forward', Buffer.byteLength(form));

            return this[makeRequest](options, form);
        }
    }, {
        key: 'url',
        value: function url(id) {
            var br = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 320;

            var body = {
                method: 'POST',
                params: {
                    ids: [id],
                    br: br * 1000
                },
                url: 'http://music.163.com/api/song/enhance/player/url'
            };

            var form = this[neteaseAESECB](body);
            var options = this[getHttpOption]('POST', '/api/linux/forward', Buffer.byteLength(form));

            return this[makeRequest](options, form);
        }
    }, {
        key: 'lyric',
        value: function lyric(id) {
            var body = {
                method: 'POST',
                params: {
                    id: id,
                    os: 'linux',
                    lv: -1,
                    kv: -1,
                    tv: -1
                },
                url: 'http://music.163.com/api/song/lyric'
            };

            var form = this[neteaseAESECB](body);
            var options = this[getHttpOption]('POST', '/api/linux/forward', Buffer.byteLength(form));

            return this[makeRequest](options, form);
        }
    }, {
        key: 'picture',
        value: function picture(id) {
            var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;


            var md5 = function md5(data) {
                var buf = Buffer.from(data);
                var str = buf.toString('binary');
                return crypto.createHash('md5').update(str).digest('base64');
            };

            var netease_pickey = function netease_pickey(id) {
                var magic = '3go8&$8*3*3h0k(2)2'.split('');
                var song_id = id.split('').map(function (item, index) {
                    return String.fromCharCode(item.charCodeAt() ^ magic[index % magic.length].charCodeAt());
                });
                var md5Code = md5(song_id.join(''));
                return md5Code.replace(/\//g, '_').replace(/\+/g, '-');
            };

            return new Promise(function (resolve, reject) {
                return resolve({
                    url: 'https://p3.music.126.net/' + netease_pickey(id) + '/' + id + '.jpg?param=' + size + 'y' + size
                });
            });
        }
    }, {
        key: neteaseAESECB,
        value: function value(body) {
            body = JSON.stringify(body);
            var password = Buffer.from(secret, 'hex').toString('utf8');
            var cipher = crypto.createCipheriv('aes-128-ecb', password, '');
            var hex = cipher.update(body, 'utf8', 'hex') + cipher.final('hex');
            var form = querystring.stringify({
                eparams: hex.toUpperCase()
            });
            return form;
        }
    }, {
        key: getHttpOption,
        value: function value(method, path, contentLength) {
            var options = {
                port: 80,
                path: path,
                method: method,
                hostname: 'music.163.com',
                headers: {
                    'referer': 'https://music.163.com/',
                    'cookie': this.cookie || randomCookies(this[getRandomHex](128)),
                    'user-agent': randomUserAgent()
                }
            };

            if ('POST' === method) {
                options['headers']['Content-Type'] = 'application/x-www-form-urlencoded';
                if (contentLength) {
                    options['headers']['Content-Length'] = contentLength;
                }
            }

            return options;
        }
    }, {
        key: getRandomHex,
        value: function value(length) {
            var isOdd = length % 2;
            var randHex = crypto.randomFillSync(Buffer.alloc((length + isOdd) / 2)).toString('hex');
            return isOdd ? randHex.slice(1) : randHex;
        }
    }, {
        key: makeRequest,
        value: function value(options, form) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                var req = http.request(options, function (res) {
                    res.setEncoding('utf8');
                    _this[onResponse](res, resolve, reject);
                });

                req.on('error', function (err) {
                    console.error('problem with request: ' + err.message);
                });

                if (form) {
                    req.write(form);
                }
                req.end();
            });
        }
    }, {
        key: onResponse,
        value: function value(response, resolve, reject) {

            var hasResponseFailed = response.status >= 400;
            var responseBody = '';

            if (hasResponseFailed) {
                reject('Request to ' + response.url + ' failed with HTTP ' + response.status);
            }

            response.on('data', function (chunk) {
                return responseBody += chunk.toString();
            });

            response.on('end', function () {
                if (!responseBody) {
                    return reject('remote result empty');
                }
                try {
                    return resolve(JSON.parse(responseBody));
                } catch (error) {
                    return resolve(responseBody);
                }
            });
        }
    }]);

    return NeteaseMusic;
}();

module.exports = NeteaseMusic;