const sql = require('../utils/widget/sql.ts');
const moment = require('moment');
const func = require('../utils/mysql.ts');
const path = require('path');
const check = require('../utils/check.ts')

function formatData(rows: any) {
    return rows.map((row: any) => {
        let date = moment(row.create_time).format('YYYY-MM-DD');
        return Object.assign({}, row, { create_time: date });
    });
}


module.exports = {
    fetchAll(req: any, res: any) {
        /**
        * @api {get} api/record/list 获取记录列表(暂时无用)
        * @apiVersion 1.0.0
        * @apiGroup record
        * 
        * @apiUse needToken
        */
        const userId: number = parseInt(check.user(req))
        if (!userId) { res.json({ code: 401, msg: '重新登录' }); return }
        func.connPool('SELECT * FROM record WHERE user_id = ?', userId, (rows: any) => {
            rows = formatData(rows);
            res.json({ code: 200, msg: 'ok', result: rows });
        });
    },

    fetchOne(req: any, res: any) {
        /**
        * @api {get} api/record/one 查询单条记录
        * @apiVersion 1.0.0
        * @apiGroup record
        * 
        * @apiUse needToken
        * 
        * @apiParam {String} id (非必须)暂无此项，不传只返回最新一条记录
        * 
        * @apiSuccess (result) {Number} after_time 记录时长(毫秒)
        * @apiSuccess (result) {Time} create_time 创建时间，国际标准时间(eg: 2019-10-25T14:44:33.000Z)
        * @apiSuccess (result) {String} event_name 事件名称
        * @apiSuccess (result) {Number} event_id 对应事件标签ID
        */
        const userId: number = parseInt(check.user(req))
        if (!userId) { res.json({ code: 401, msg: '重新登录' }); return }
        func.connPool("SELECT r.*,r_e.NAME AS 'event_name' FROM record r INNER JOIN record_event r_e ON r.event_id=r_e.id WHERE r.user_id=? ORDER BY id DESC LIMIT 1", userId, (rows: any) => {
            res.json({ code: 200, msg: 'ok', result: rows[0] });
        });
    },

    // 添加|更新
    async addOne(req: any, res: any) {
        /**
        * @api {post} api/record/add 添加/更新记录
        * @apiVersion 1.0.0
        * @apiGroup record
        * @apiDescription 注意：event_id和id都不传视为错误请求; 该api会更新用户储存的时间，以及更新标签的总时间
        * 
        * @apiUse needToken
        * 
        * @apiParam {Number} event_id 选择的事件ID
        * @apiParam {Number} id 有传id时为"更新该记录"
        * @apiParam {Number} after_time 更新记录时传递持续时间(毫秒)
        */
        const userId = check.user(req)
        if (!userId) { res.json({ code: 401, msg: '重新登录' }); return }

        const id = req.body.id;
        let eventId = req.body.event_id;
        const afterTime = req.body.after_time || 0;
        let query, arr;

        if (!eventId && !id) {
            res.send({ code: 0, msg: '参数错误' }); return
        }

        if (id) {
            // 更新
            if (afterTime <= 0) {
                res.send({ code: 0, msg: '时间错误' }); return
            }
            query = 'UPDATE record SET after_time=? WHERE id=?';
            arr = [afterTime, id];
            func.pConnPool(sql.queryById, ['record', id]).then((rows: any) => {
                eventId = rows[0].event_id
            })
            func.pConnPool(sql.queryById, ['record', id]).then((rows: any) => {
                eventId = rows[0].event_id
            })
        } else {
            // 新增
            query = 'INSERT INTO record(event_id, after_time, user_id) VALUES(?,?,?)';
            arr = [eventId, afterTime, userId];
        }

        func.connPool(query, arr, async (rows: any) => {
            // 更新用户储存的时间
            const ratio = 1.8 // 转换系数
            const user = await func.pConnPool(sql.queryById, ['user', userId]);
            const hourglassTime = (parseInt(afterTime) / ratio) + parseInt(user[0].hourglass)
            func.connPool('UPDATE user SET hourglass=? WHERE id=?', [hourglassTime, userId], async (r: any) => {
                const event = await func.pConnPool(sql.queryById, ['record_event', eventId]);
                const newTime = parseInt(afterTime) + parseInt(event[0].after_time)
                // 更新标签的总时间
                func.connPool('UPDATE record_event SET after_time=? WHERE id=?', [newTime, eventId], async (r: any) => {
                    const data = await func.pConnPool('SELECT * FROM record WHERE user_id = ? ORDER BY id desc LIMIT 1', userId)
                    res.send({ code: 200, msg: '打卡记录创建', result: data[0] });
                })
            })
        });

    },

    deleteOne(req: any, res: any) {
        /**
        * @api {post} api/record/delete 删除记录
        * @apiVersion 1.0.0
        * @apiGroup record
        * 
        * @apiUse needToken
        * 
        * @apiParam {Number} id 删除记录的ID
        */
        const userId = check.user(req)
        if (!userId) { res.json({ code: 401, msg: '重新登录' }); return }

        const id = req.body.id;
        if (!id) { res.json({ code: 404, msg: '无id' }); return }

        func.connPool(sql.del, ['record', id], (rows: any) => {
            res.send({ code: 200, msg: '记录删除' });
        });

    }
};

export { }
