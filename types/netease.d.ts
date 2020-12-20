/**
 * @file NeteaseMusic Class
 * @author Surmon <https://github.com/surmon-china>
 */
declare type songId = string;
interface NeteaseMusicOption {
    cookie?: string;
}
declare const neteaseAESECB: unique symbol;
declare const getHttpOption: unique symbol;
declare const getRandomHex: unique symbol;
declare const makeRequest: unique symbol;
export default class NeteaseMusic {
    private cookie;
    constructor(options?: NeteaseMusicOption);
    /**
     * 私有方法，加密
     * @param {Object} body 表单数据
     * @return {String} 加密后的表单数据
     */
    private [neteaseAESECB];
    /**
     * 获取请求选项
     * @param {String} method GET | POST
     * @param {String} path http 请求路径
     * @param {Integer} contentLength 如何是 POST 请求，参数长度
     * @return Object
     */
    private [getHttpOption];
    /**
     * 获取随机字符串
     * @param {Integer} length 生成字符串的长度
     */
    private [getRandomHex];
    /**
     * 发送请求
     * @param {Object} options 请求选项
     * @param {String} form 表单数据
     * @return Promise
     */
    private [makeRequest];
    /**
     * 根据关键词获取歌曲列表
     * @param {Integer} string 关键词
     * @return {Promise}
     */
    search(keyword?: string, page?: number, limit?: number): Promise<any>;
    /**
     * 根据艺术家 id 获取艺术家信息
     * @param {Integer} string 艺术家 id
     * @return {Promise}
     */
    artist(id: songId, limit?: number): Promise<any>;
    /**
     * Get playlist by playlist ID
     * @param {Integer} string 歌单 id
     * @return {Promise}
     */
    playlist(id: songId, limit?: number): Promise<any>;
    /**
     * HACK: Get playlist by playlist ID
     * @param {Integer} string 歌单 id
     * @return {Promise}
     */
    _playlist(id: songId, limit?: number): Promise<any>;
    /**
     * 根据专辑 id 获取专辑信息及歌曲列表
     * @param {Integer} string 专辑 id
     * @return {Promise}
     */
    album(id: songId): Promise<any>;
    /**
     * 根据歌曲 id 获取歌曲信息
     * @param {Integer} string 歌曲 id
     * @return {Promise}
     */
    song(id: songId | songId[]): Promise<any>;
    /**
     * 根据歌曲 id 获取歌曲资源地址
     * @param {Integer} string 歌曲 id
     * @return {Promise}
     */
    url(id: songId | songId[], br?: number): Promise<any>;
    /**
     * 根据歌曲 id 获取歌词
     * @param {Integer} string 歌曲 id
     * @return {Object}
     */
    lyric(id: songId): Promise<any>;
    /**
     * 根据封面图片 id 获取图片地址
     * @param {Integer} string 图片 id
     * @return {Object}
     */
    picture(id: songId, size?: number): Promise<{
        url: string;
    }>;
}
export {};
