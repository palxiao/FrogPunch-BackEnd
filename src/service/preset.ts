/*
 * @Author: ShawnPhang
 * @Date: 2021-12-12 09:46:21
 * @Description: 预设
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-12-12 15:11:01
 * @site: book.palxp.com / blog.palxp.com
 */
const sql = require('../utils/widget/sql.ts')
const func = require('../utils/mysql.ts')
const check = require('../utils/check.ts')

module.exports = {
  fetchAll(req: any, res: any) {
    /**
     * @api {get} api/preset/list 获取全部预设
     * @apiVersion 1.0.0
     * @apiGroup preset
     *
     * @apiUse needToken
     *
     * @apiSuccess (result) {String} name (标题)
     * @apiSuccess (result) {String} data (目标JSON 当天数据)
     *
     */
    const userId: number = parseInt(check.user(req))
    if (!userId) {
      res.json({ code: 401, msg: '重新登录' })
      return
    }

    let query = 'SELECT id, name, data FROM target_preset WHERE user_id = ? ORDER BY id DESC'

    func.connPool(query, userId, async (rows: Type.Object[]) => {
        rows.forEach(item => {
            item.data = JSON.parse(item.data)
        });
      res.json({ code: 200, msg: 'ok', result: rows })
    })
  },

  addUpdateOne(req: any, res: any) {
    /**
     * @api {post} api/preset/addUpdate 添加|编辑预设
     * @apiVersion 1.0.0
     * @apiGroup preset
     *
     * @apiUse needToken
     *
     * @apiParam {String} name 标题
     * @apiParam {Number} xxxx 权重(预留，未设计)
     * @apiParam {Number|Array} id (有值则为编辑) 目标id，为数组时编辑多个
     * @apiParam {String} data (非必传) 所有当天数据JSON
     */
    const userId = check.user(req)
    if (!userId) {
      res.json({ code: 401, msg: '重新登录' })
      return
    }

    const id = req.body.id
    let { data, name } = req.body
    data = typeof data === 'undefined' ? [] : data
    let query,
      arr: any = [],
      fields: any = []

    if (id) {
      // 更新
      name && arr.unshift(name) && fields.unshift(`name=?`)
      data && arr.unshift(JSON.stringify(data)) && fields.unshift(`data=?`)
      query = `UPDATE target_preset SET ${fields + ''} WHERE id in (${id + ''})`
    } else {
      if (!name) {
        res.send({ code: 0, msg: '目标内容不能为空' })
        return
      }
      query = 'INSERT INTO target_preset(name, user_id, data) VALUES(?,?,?)'
      arr = [name, userId, JSON.stringify(data)]
    }

    func.connPool(query, arr, async (rows: any) => {
      res.send({ code: 200, msg: ' done' })
    })
  },

  deleteOne(req: any, res: any) {
    /**
     * @api {post} api/preset/delete 删除预设
     * @apiVersion 1.0.0
     * @apiGroup preset
     * @apiDescription 删除后无法恢复
     *
     * @apiUse needToken
     *
     * @apiParam {Number} id 预设
     */
    const userId = check.user(req)
    if (!userId) {
      res.json({ code: 401, msg: '重新登录' })
      return
    }

    const id = req.body.id

    func.connPool(sql.del, ['target_preset', id], (rows: any) => {
      res.send({ code: 200, msg: '预设已删除' })
    })
  },
}
