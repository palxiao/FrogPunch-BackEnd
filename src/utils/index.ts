const jwt = require('jwt-simple')
const request = require('request-promise-native')

module.exports = {
    getToken(id: number) {
        const payload = {
            iss: id,
            exp: Date.now() + 7 * 24 * 60 * 60 * 1000
        }
        return jwt.encode(payload, 'jwtTokenSecret');
    },
    async getWxToken() {
        const APPID = 'wx73245ddf5809300c'
        const APPSECRET = '68832df4408c1a95b67103205a628936'
        const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
        const result = await request({
            url,
            headers: {
                'content-type': 'application/json',
            },
        })
        return JSON.parse(result).access_token
    },
    async sendDingYueMessage(wxToken: string, data: any[]) {
        const url2 = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${wxToken}`
        await request({
            url: url2,
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(data),
        })
    }
}
export { }