const sql = require('../utils/widget/sql.ts');
const moment = require('moment');
const func = require('../utils/mysql.ts');
// const path = require('path');
const check = require('../utils/check.ts')

function formatData(rows: any) {
    return rows.map((row: any) => {
        const create_time = moment(row.create_time).format('YYYY-MM-DD');
        const update_time = moment(row.update_time).format('YYYY-MM-DD');
        return Object.assign({}, row, { create_time, update_time });
    });
}


module.exports = {
    fetchAll(req: any, res: any) {
        const userId: number = parseInt(check.user(req))
        if (!userId) { res.json({ code: 401, msg: '重新登录' }); return }
        func.connPool(sql.queryAll, 'note', (rows: any) => {
            rows = formatData(rows);
            res.json({ code: 200, msg: 'ok', result: rows });
        });
    },

    // fetchById(req: any, res: any) {
    //     const userId: number = parseInt(check.user(req))
    //     if (!userId) { res.json({ code: 401, msg: '重新登录' }); return }

    //     const id = req.body.id;

    //     func.connPool(sql.queryById, ['note', id], (rows: any) => {
    //         rows = formatData(rows);
    //         res.json({ code: 200, msg: 'ok', result: rows[0] });
    //     });
    // },

    // 添加|更新 商品
    addOne(req: any, res: any) {
        /**
        * @api {post} api/note/add 新增/更新记事
        * @apiVersion 1.0.0
        * @apiGroup note
        * 
        * @apiUse needToken
        * 
        * @apiParam {String} text 记事内容/更新内容
        * @apiParam {Number} id 传id时为更新记事
        * 
        * @apiSuccess (result) {Time} create_time 创建时间(标准时间 eg: 2019-12-08 17:44:04)
        * @apiSuccess (result) {Time} update_time 更新时间(国际标准时间)
        * @apiSuccess (result) {Unknow} imgs 未启用，预留值
        */
        const userId: number = parseInt(check.user(req))
        if (!userId) { res.json({ code: 401, msg: '重新登录' }); return }

        const id = req.body.id;
        const text = req.body.text;
        let query, arr;

        if (id) {
            // 更新
            const updateTime = moment().format('YYYY-MM-DD HH:mm:ss')
            query = 'UPDATE note SET text=?, update_time=? WHERE id=?';
            arr = [text, updateTime, id];
        } else {
            // 新增
            query = 'INSERT INTO note(text, user_id) VALUES(?,?)';
            arr = [text, userId];
        }

        func.connPool(query, arr, async (rows: any) => {
            const data = await func.pConnPool('SELECT * FROM note WHERE user_id = ? ORDER BY id desc', userId)
            const result = data[0]
            result.create_time = moment(result.create_time).format('YYYY-MM-DD HH:mm:ss')
            res.send({ code: 200, msg: 'done', result });
        });

    },


    deleteOne(req: any, res: any) {
        /**
        * @api {post} api/note/delete 删除单条记事
        * @apiVersion 1.0.0
        * @apiGroup note
        * 
        * @apiUse needToken
        * 
        * @apiParam {Number} id 必传，删除记录的ID
        */
        const userId: number = parseInt(check.user(req))
        if (!userId) { res.json({ code: 401, msg: '重新登录' }); return }

        const id = req.body.id;

        if (!id) {
            res.send({ code: 0, msg: 'id不能为空' }); return
        }

        func.connPool(sql.del, ['note', id], (rows: any) => {
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

    // uploadGoodsImg(req, res) {
    //     let absolutePath = path.resolve(__dirname, req.file.path);
    //     let a = 2;

    //     func.connPool('UPDATE goods SET imgs = ? WHERE id = ?', [absolutePath, 60], (err, rows) => {
    //         console.log(a);
    //         res.send({ code: 200, msg: 'done', url: absolutePath });
    //     }, res);
    // },
};

export { }