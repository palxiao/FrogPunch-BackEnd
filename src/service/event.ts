const sql = require('../utils/widget/sql.ts');
const moment = require('moment');
const func = require('../utils/mysql.ts');
const path = require('path');
const check = require('../utils/check.ts')

// function formatData(rows) {
//     return rows.map(row => {
//         let date = moment(row.create_time).format('YYYY-MM-DD');
//         return Object.assign({}, row, { create_time: date });
//     });
// }

module.exports = {
    fetchAll(req: any, res: any) {
        /**
        * @api {get} api/event/list 获取个人事件列表
        * @apiVersion 1.0.0 
        * @apiGroup event
        * 
        * @apiUse needToken
        * 
        * @apiSuccess (result) {Number} after_time 事件经历时长(毫秒)
        * 
        */
        const userId: number = parseInt(check.user(req))
        if (!userId) { res.json({ code: 401, msg: '重新登录' }); return }
        let query = 'SELECT * FROM record_event WHERE user_id = ?'
        if (req.query.time_order) { query += ' ORDER BY after_time ' + req.query.time_order }
        func.connPool(query, userId, (rows: any) => {
            // rows = formatData(rows);
            res.json({ code: 200, msg: 'ok', result: rows });
        });
    },
    
    addOne(req: any, res: any) {
        /**
        * @api {post} api/event/add 添加/更新事件标签
        * @apiVersion 1.0.0
        * @apiGroup event
        * 
        * @apiUse needToken
        * 
        * @apiParam {String} name 标签名
        * @apiParam {Number} id(非必须) 指定此字段时既为更新该标签
        * @apiParam {Number} after_time(非必须) 当为更新标签时修改后的时间(毫秒)
        */
        const userId = check.user(req)
        if (!userId) { res.json({ code: 401, msg: '重新登录' }); return }
        const id = req.body.id;
        const name = req.body.name;
        const time = req.body.after_time || 0;
        let query, arr;

        if (!name) {
            res.send({ code: 0, msg: 'name不能为空' }); return
        }
        if (id) {
            // 更新
            if (time <= 0) {
                res.send({ code: 0, msg: '时间错误' }); return
            }
            query = 'UPDATE record_event SET name=?, after_time=? WHERE id=?';
            arr = [name, time, id];
        } else {
            // 新增
            query = 'INSERT INTO record_event(name, after_time, user_id) VALUES(?,?,?)';
            arr = [name, time, userId];
        }

        func.connPool(query, arr, async (rows: any) => {
            const data = await func.pConnPool('SELECT * FROM record_event WHERE user_id = ? ORDER BY id desc', userId)
            res.send({ code: 200, msg: name + ' 已创建', result: data[0] });
        });
    },

    deleteOne(req: any, res: any) {
        /**
        * @api {post} api/event/delete 删除事件标签
        * @apiVersion 1.0.0
        * @apiGroup event
        * @apiDescription 删除后无法恢复
        * 
        * @apiUse needToken
        * 
        * @apiParam {Number} id 事件标签id
        */
        const userId = check.user(req)
        if (!userId) { res.json({ code: 401, msg: '重新登录' }); return }

        const id = req.body.id;

        func.connPool(sql.del, ['record_event', id], (rows: any) => {
            res.send({ code: 200, msg: 'done' });
        });

    },

    // 批量删除
    // deleteMulti(req, res) {
    //     let id = req.body.id;

    //     func.connPool('DELETE FROM goods WHERE id IN ?', [[id]], rows => {
    //         res.send({ code: 200, msg: 'done' });

    //     });

    // },
};

export { }

