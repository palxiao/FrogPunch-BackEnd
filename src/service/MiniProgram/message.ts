const sql = require('../../utils/widget/sql.ts')
// const moment = require('moment');
const func = require('../../utils/mysql.ts')
const check = require('../../utils/check.ts')
const $utils = require('../../utils/index.ts')

module.exports = {
    async sendSubscribe(req: any, res: any) {
        /**
         * @api {get} mp/dingyue 发送小程序订阅消息
         * @apiVersion 1.0.0
         * @apiGroup miniProgram
         *
         * @apiParam {String} tmplIds 模板Id (暂时无用)
         * @apiParam {String} openId 无保存用户关键信息 暂时直传
         * @apiParam {String} title 无查询打卡关键信息 暂时直传
         *
         */
        const userId = check.user(req)
        if (!userId) { res.json({ code: 401, msg: '重新登录' }); return }

        // const tmplIds = req.body.tmplIds
        const openId = req.body.openId
        const title = req.body.title

        // 处理订阅消息
        $utils.sendDingYueMessage(await $utils.getWxToken(), {
            "touser": openId,
            "template_id": "PlBadng7ysQ69eeB28QnTYQCxHWdDtE_IKYkwMoWw68",
            // "template_id": "D2pHbPhfLo74vomL8240r16yXVbKsZXjJsFYq2FBorM",
            "page": "pages/index",
            "data": {
                "thing1": {
                    "value": '【打卡】'+title
                },
                "thing2": {
                    "value": "记得回来完成打卡任务"
                }
                // "time3": {
                //     "value": "记得回来完成打卡任务"
                // }
            }
        })

        res.send({ code: 200, msg: 'done'})
    },
}

export { }
