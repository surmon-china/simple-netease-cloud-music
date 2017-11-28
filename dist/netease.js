'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var http = require('http');
var pack = require('./pack');
var crypto = require('crypto');
var Buffer = require('buffer').Buffer;
var querystring = require('querystring');

var neteaseAESECB = Symbol('neteaseAESECB');
var getHttpOption = Symbol('getHttpOption');
var makeRequest = Symbol('makeRequest');
var onResponse = Symbol('onResponse');

var secret = '7246674226682325323F5E6544673A51';

var Netease = function () {
    function Netease() {
        _classCallCheck(this, Netease);
    }

    _createClass(Netease, [{
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
                var buf = new Buffer(data);
                var str = buf.toString('binary');
                return crypto.createHash("md5").update(str).digest('hex');
            };

            var netease_pickey = function netease_pickey(id) {
                var magic = '3go8&$8*3*3h0k(2)2'.split('');
                var song_id = id.split('').map(function (item, index) {
                    return String.fromCharCode(item.charCodeAt() ^ magic[index % magic.length].charCodeAt());
                });
                var md5Code = md5(song_id.join(''));
                var base64Code = Buffer.from(md5Code, 'hex').toString('base64');
                return base64Code.replace('/', '_').replace('+', '-');
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
            var password = pack('H*', secret);
            var cipher = crypto.createCipheriv('aes-128-ecb', password, '');
            body = cipher.update(body, 'utf8', 'base64') + cipher.final('base64');
            var hex = new Buffer(body, 'base64').toString('hex');
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
                    'cookie': 'os=linux; appver=1.0.0.1026; osver=Ubuntu%2016.10; MUSIC_U=78d411095f4b022667bc8ec49e9a44cca088df057d987f5feaf066d37458e41c4a7d9447977352cf27ea9fee03f6ec4441049cea1c6bb9b6; __remember_me=true',
                    'useragent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
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
                return resolve(JSON.parse(responseBody));
            });
        }
    }]);

    return Netease;
}();

module.exports = Netease;