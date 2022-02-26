const sql = require('../utils/widget/sql.ts')
const func = require('../utils/mysql.ts')
const check = require('../utils/check.ts')

module.exports = {
  fetchAll(req: any, res: any) {
    /**
     * @api {get} api/target/list 获取目标列表
     * @apiVersion 1.0.0
     * @apiGroup target
     *
     * @apiUse needToken
     *
     * @apiSuccess (result) {String} name (目标内容)
     *
     */
    const userId: number = parseInt(check.user(req))
    if (!userId) {
      res.json({ code: 401, msg: '重新登录' })
      return
    }

    let query = 'SELECT id, name, is_done, type FROM target WHERE user_id = ? ORDER BY id DESC'

    func.connPool(query, userId, async (rows: Type.Object[]) => {
      const query = `SELECT te.id, te.event_id, r_e.NAME AS 'event_name' FROM target_event te INNER JOIN record_event r_e ON te.event_id=r_e.id WHERE te.target_id= ?`
      for (const item of rows) {
        const data = await func.pConnPool(query, item.id)
        item.events = data
      }
      res.json({ code: 200, msg: 'ok', result: rows })
    })
  },

  addUpdateOne(req: any, res: any) {
    /**
     * @api {post} api/target/addUpdate 添加|编辑目标
     * @apiVersion 1.0.2
     * @apiGroup target
     *
     * @apiUse needToken
     *
     * @apiParam {String} name 目标内容(不可编辑)
     * @apiParam {Number} xxxx 权重(预留，未设计)
     * @apiParam {Number|Array} id (有值则为编辑) 目标id，为数组时编辑多个
     * @apiParam {Number} is_done (非必传)是否完成 0默认 1已完成
     * @apiParam {String} type (非必传) 设置计划的类型，1今日 2周 3月
     */
    const userId = check.user(req)
    if (!userId) {
      res.json({ code: 401, msg: '重新登录' })
      return
    }

    const id = req.body.id
    let { is_done: isDone, type, name } = req.body
    isDone = typeof isDone === 'undefined' ? null : isDone + ''
    type = typeof type === 'undefined' ? null : type + ''
    let query,
      arr: any = [],
      fields: any = []

    if (id) {
      // 更新
      type && arr.unshift(type) && fields.unshift(`type=?`)
      isDone && arr.unshift(isDone) && fields.unshift('is_done=?')
      query = `UPDATE target SET ${fields + ''} WHERE id in (${id + ''})`
    } else {
      if (!name) {
        res.send({ code: 0, msg: '目标内容不能为空' })
        return
      }
      query = 'INSERT INTO target(name, user_id) VALUES(?,?)'
      arr = [name, userId]
    }

    func.connPool(query, arr, async (rows: any) => {
      // const data = await func.pConnPool('SELECT * FROM target WHERE user_id = ? ORDER BY id desc', userId)
      // res.send({ code: 200, msg: name + ' 已创建', result: data[0] });
      res.send({ code: 200, msg: ' done' })
    })
  },

  deleteOne(req: any, res: any) {
    /**
     * @api {post} api/target/delete 删除目标
     * @apiVersion 1.0.0
     * @apiGroup target
     * @apiDescription 删除后无法恢复；会删除对应的标签记录
     *
     * @apiUse needToken
     *
     * @apiParam {Number} id 目标
     */
    const userId = check.user(req)
    if (!userId) {
      res.json({ code: 401, msg: '重新登录' })
      return
    }

    const id = req.body.id

    func.connPool(sql.del, ['target', id], (rows: any) => {
      // 删除对应目标下的标签
      const query = `DELETE te FROM target_event te WHERE te.target_id = ?`
      func.connPool(query, id, () => {
        res.send({ code: 200, msg: '目标已删除' })
      })
    })
  },

  async bindEvent(req: any, res: any) {
    /**
     * @api {post} api/target/bind_event 添加目标任务事件
     * @apiVersion 1.0.0
     * @apiGroup target
     *
     * @apiUse needToken
     *
     * @apiParam {Number} target_id 目标
     * @apiParam {Number} event_id 打卡标签
     */
    const userId = check.user(req)
    if (!userId) {
      res.json({ code: 401, msg: '重新登录' })
      return
    }

    const targetId = req.body.target_id
    const eventId = req.body.event_id

    const query = 'SELECT * from target_event where target_id = ? AND event_id = ?'
    const insert = 'INSERT INTO target_event(target_id, event_id) VALUES(?,?)'
    const arr = [targetId, eventId]

    const searchRows = await func.pConnPool(query, arr)
    if (searchRows.length) {
      res.send({ code: 200, msg: '目标下已有该任务' })
    } else {
      func.connPool(insert, arr, () => {
        res.send({ code: 200, msg: '绑定打卡任务！' })
      })
    }
  },

  deleteEvent(req: any, res: any) {
    /**
     * @api {post} api/target/delete_event 删除目标下的标签
     * @apiVersion 1.0.0
     * @apiGroup target
     * @apiDescription 删除后无法恢复
     *
     * @apiUse needToken
     *
     * @apiParam {Number} id 打卡标签
     */
    const userId = check.user(req)
    if (!userId) {
      res.json({ code: 401, msg: '重新登录' })
      return
    }

    const id = req.body.id

    func.connPool(sql.del, ['target_event', id], (rows: any) => {
      res.send({ code: 200, msg: '标签已删除' })
    })
  },
}

export {}
