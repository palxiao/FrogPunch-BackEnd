const sql = require('../../utils/widget/sql.ts')
// const moment = require('moment');
const func = require('../../utils/mysql.ts')
// const check = require('../../utils/check.ts')

module.exports = {
  audit(req: any, res: any) {
    /**
     * @api {get} mp/audit 小程序审核机制开关
     * @apiVersion 1.0.0
     * @apiGroup miniProgram
     *
     * @apiParam {Number} id 小程序id
     * @apiParam {Number} status 0审核中，1已发布
     *
     */
    const id = req.query.id
    const status = req.query.status

    let query = 'SELECT * from mini_program where id = ?'
    let params = [id]

    if (status) {
      // 更新状态
      query = 'UPDATE mini_program SET status=? WHERE id=?'
      params = [status, id]
    }

    func.connPool(query, params, (rows: any) => {
      res.send({ code: 200, msg: 'done', result: rows[0] })
    })
  },
  makingData(req: any, res: any) {
    /**
     * @api {get} mp/yanye/makingData 图片制作数据
     * @apiVersion 1.0.0
     * @apiGroup miniProgram
     * @apiDescription 言叶图签制作图片数据
     *
     * @apiParam {Number} id 模板id(可选，不传取所有)
     *
     * @apiSuccess (result) {String} name 模板名称
     * @apiSuccess (result) {String} url 预览图片链接
     * @apiSuccess (result) {String} imgsData 图片数据
     * @apiSuccess (result) {String} drawData canvas绘制数据
     */
    const id = req.query.id
    const data = ['mini_program_yan_ye']
    if (id) {
      data.push(id)
    }

    func.connPool(sql[id ? 'queryById' : 'queryAll'], data, (rows: any) => {
      res.json({ code: 200, msg: 'ok', result: rows })
    })
  },
  addData(req: any, res: any) {
    /**
     * @api {post} mp/yanye/addData 添加/更新图签模板
     * @apiVersion 1.0.0
     * @apiGroup miniProgram
     *
     * @apiParam {Number} id(非必须) 指定此字段时既为更新
     * @apiParam {String} name(非必须) 模板名称
     * @apiParam {String} url(非必须) 预览图片链接
     * @apiParam {String} config
     * @apiParam {String} imgsData
     * @apiParam {String} drawData
     */
    const id = req.body.id
    const name = req.body.name || ''
    const url = req.body.url || ''
    let query, arr
    
    if (id) {
      // 更新
      query = 'UPDATE mini_program_yan_ye SET name=?, url=?, config=?, imgs_data=?, draw_data=? WHERE id=?'
      arr = [name, url, req.body.config, req.body.imgData, req.body.drawData, id]
    } else {
      // 新增
      query = 'INSERT INTO mini_program_yan_ye(name, url, config, imgs_data, draw_data) VALUES(?,?,?,?,?)'
      arr = [name, url, req.body.config, req.body.imgsData, req.body.drawData]
    }

    func.connPool(query, arr, async (rows: any) => {
    //   const data = await func.pConnPool('SELECT * FROM mini_program_yan_ye WHERE user_id = ? ORDER BY id desc', userId)
      res.send({ code: 200, msg: ' 已创建' })
    })
  },
}

export {}
