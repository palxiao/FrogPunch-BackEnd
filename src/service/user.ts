const sql = require('../utils/widget/sql.ts')
const moment = require('moment')
const bcrypt = require('bcryptjs')
const func = require('../utils/mysql.ts')
const $utils = require('../utils/index.ts')
const check = require('../utils/check.ts')

function formatData(rows: any) {
  return rows.map((row: any) => {
    const date = moment(row.create_time).format('YYYY-MM-DD')
    const obj = {}
    delete row.password
    return Object.assign({}, row, { create_time: date }, obj)
  })
}

module.exports = {
  fetchAll(req: any, res: any) {
    func.connPool(sql.queryAll, 'user', (rows: any) => {
      rows = formatData(rows)
      res.json({ code: 200, msg: 'ok', users: rows })
    })
  },

  addOne(req: any, res: any) {
    /**
     * @api {post} api/user/add 注册 - 账号密码
     * @apiVersion 1.0.0
     * @apiGroup user
     *
     * @apiParam {String} name 用户名，唯一值
     * @apiParam {String} pass 用户密码
     */
    const name = req.body.name
    let pass = req.body.pass
    const query = 'INSERT INTO user(user_name, password) VALUES(?, ?)'

    func.connPool('SELECT * from user where user_name = ?', [name], (rows: any) => {
      if (!rows.length) {
        // 用户不存在
        bcrypt.hash(pass, 10, (err: any, hash: any) => {
          if (err) console.log(err)

          pass = hash

          const arr = [name, pass]

          func.connPool(query, arr, (rows: any) => {
            res.json({ code: 200, msg: '注册成功' })
          })
        })
      } else {
        res.json({ code: 201, msg: '用户已存在' })
      }
    })
  },

  // 删除用户
  deleteOne(req: any, res: any) {
    const id = req.body.id

    func.connPool(sql.del, ['user', id], (rows: any) => {
      res.json({ code: 200, msg: 'done' })
    })
  },

  // 批量删除
  deleteMulti(req: any, res: any) {
    const id = req.body.id

    func.connPool('DELETE FROM user WHERE id IN ?', [[id]], (rows: any) => {
      res.json({ code: 200, msg: 'done' })
    })
  },

  login(req: any, res: any) {
    /**
     * @api {post} api/user/login 登陆 - 账号密码
     * @apiVersion 1.0.0
     * @apiGroup user
     *
     * @apiParam {String} user_name 用户名
     * @apiParam {String} pass 密码
     *
     * @apiSuccess (result) {String} token 用户token
     */
    const user_name = req.body.user_name
    const pass = req.body.pass

    func.connPool('SELECT * from user where user_name = ?', [user_name], (rows: any) => {
      if (!rows.length) {
        res.json({ code: 400, msg: '用户名不存在' })
        return
      }

      const password = rows[0].password
      bcrypt.compare(pass, password, (err: any, sure: any) => {
        if (err) {
          console.log(err)
        }
        if (sure) {
          const user = {
            user_id: rows[0].id,
            user_name: rows[0].user_name,
            token: $utils.getToken(rows[0].id),
          }

          // req.session.login = user

          res.json({ code: 200, msg: '登录成功', result: user })
        } else {
          res.json({ code: 400, msg: '密码错误' })
        }
      })
    })
  },

  // 自动登录
  autoLogin(req: any, res: any) {
    const user = req.session.login
    if (user) {
      res.json({ code: 200, msg: '自动登录', user: user })
    } else {
      res.json({ code: 400, msg: 'not found' })
    }
  },

  /**
   * @api {post} api/user/fingerLogin 登陆 - 浏览器指纹 / 完善账号
   * @apiVersion 1.0.0
   * @apiGroup user
   * @apiDescription 一键登录，用于微信H5订阅号无微信登录权限的临时解决方案
   *
   * @apiParam {Number} finger 浏览器指纹，有则登录
   * @apiParam {Number} user_name (可选) 完善账号，可使用账号登录
   * @apiParam {Number} pass 完善账号的密码
   *
   * @apiSuccess (result) {String} token 用户token
   */
  fingerLogin(req: any, res: any) {
    const fingerprint = req.body.finger || 0
    const userName = req.body.user_name
    let pass = req.body.pass
    func.connPool('SELECT * from user where fingerprint = ?', fingerprint, (rows: any) => {
      if (!rows.length) {
        if (!fingerprint || fingerprint.toString().length < 4) {
          res.json({ code: 402, msg: '登陆失败' })
          return
        }
        res.json({ code: 402, msg: '查无用户' })
        return
      }
      // 查询对应账号登陆
      delete rows[0].password
      rows[0].token = $utils.getToken(rows[0].id)

      // 用户后续完善信息
      const updateUserId = rows[0].id
      if (userName) {
        func.connPool('SELECT * from user where user_name = ?', userName, (rows: any) => {
          if (!rows.length) {
            // 用户名没重复
            bcrypt.hash(pass, 10, (err: any, hash: any) => {
              if (err) console.log(err)
              pass = hash
              const arr = [userName, pass, updateUserId]
              const query = 'UPDATE user SET user_name=?,password=? WHERE id=?'
              func.connPool(query, arr, (rows: any) => {
                res.json({ code: 200, msg: '更新成功' })
              })
            })
          } else {
            res.json({ code: 201, msg: '用户已存在' })
          }
        })
      } else {
        res.json({ code: 200, msg: '登录成功', result: rows[0] })
      } // 正常登录逻辑
    })
  },

  /**
   * @api {get} api/user/get 获取用户信息
   * @apiVersion 1.0.0
   * @apiGroup user
   * @apiDescription 获取信息
   *
   * @apiSuccess (result) {String} user 用户信息
   */
  getOne(req: any, res: any) {
    const userId: number = parseInt(check.user(req))
    if (!userId) {
      res.json({ code: 401, msg: '重新登录' })
      return
    }
    func.connPool('SELECT * from user where id = ?', userId, (rows: any) => {
      if (!rows.length) {
        res.json({ code: 402, msg: '查无用户' })
        return
      }
      // 查询对应账号登陆
      delete rows[0].password
      // rows[0].token = $utils.getToken(rows[0].id)
      res.json({ code: 200, msg: '登录成功', result: rows[0] })
    })
  },

  /**
   * @api {post} api/user/update 更新用户信息
   * @apiVersion 1.0.0
   * @apiGroup user
   * @apiDescription 更新用户
   *
   * @apiParam {Number} hourglass 用户的储存时间
   *
   */
  updateUser(req: any, res: any) {
    const userId: number = parseInt(check.user(req))
    if (!userId) {
      res.json({ code: 401, msg: '重新登录' })
      return
    }
    const hourglassTime = req.body.hourglass
    if (hourglassTime) {
      func.connPool('UPDATE user SET hourglass=? WHERE id=?', [hourglassTime, userId], async (r: any) => {
        res.json({ code: 200, msg: 'ok update' })
      })
    }
  },

  /**
   * @api {post} api/user/fingerRegister 注册 - 浏览器指纹
   * @apiVersion 1.0.0
   * @apiGroup user
   * @apiDescription 一键登录，用于微信H5订阅号无微信登录权限的临时解决方案
   *
   * @apiParam {Number} finger 浏览器指纹，注册账号
   *
   * @apiSuccess (result) {String} token 用户token
   */
  fingerRegister(req: any, res: any) {
    const fingerprint = req.body.finger || 0
    func.connPool('SELECT * from user where fingerprint = ?', fingerprint, (rows: any) => {
      if (!rows.length) {
        if (!fingerprint || fingerprint.toString().length < 4) {
          res.json({ code: 402, msg: '参数错误，注册失败' })
          return
        }
        // 创建账号
        const query = 'INSERT INTO user(fingerprint) VALUES(?)'
        func.connPool(query, fingerprint, async (rows: any) => {
          const data = await func.pConnPool('SELECT * FROM user ORDER BY id desc LIMIT 1')
          const result = data[0]
          result.token = $utils.getToken(result.id)
          res.json({ code: 200, msg: '登录成功', result })
        })
        return
      }
      // 查询对应账号登陆
      delete rows[0].password
      rows[0].token = $utils.getToken(rows[0].id)
      res.json({ code: 201, msg: '已有用户，无法注册', result: rows[0] })
    })
  },

  /**
   * @api {post} api/user/bindFinger 用户绑定浏览器
   * @apiVersion 1.0.0
   * @apiGroup user
   * @apiDescription 一键登录，用于微信H5订阅号无微信登录权限的临时解决方案
   *
   * @apiUse needToken
   *
   * @apiParam {Number} finger 浏览器指纹，绑定在已有账号上（唯一性，账号是否已有finger需自行判断）
   *
   * @apiSuccess (result) {String} token 用户token
   */
  bindFinger(req: any, res: any) {
    const userId: number = parseInt(check.user(req))
    if (!userId) {
      res.json({ code: 401, msg: '重新登录' })
      return
    }

    const fingerprint = req.body.finger || 0

    if (!fingerprint || fingerprint.toString().length < 2) {
      res.json({ code: 400, msg: '参数错误' })
      return
    } else {
      func.connPool('SELECT * from user where fingerprint = ?', fingerprint, async (rows: any) => {
        if (rows.length) {
          // 归零
          const query = 'UPDATE user SET fingerprint=? WHERE id=?'
          await func.pConnPool(query, [null, rows[0].id], (rows: any) => {})
        }
        // 绑定浏览器finger
        const query = 'UPDATE user SET fingerprint=? WHERE id=?'
        func.connPool(query, [fingerprint, userId], (rows: any) => {
          res.json({ code: 200, msg: '绑定成功，可一键登录该账户' })
        })
      })
    }
  },

  // 注销
  logout(req: any, res: any) {
    req.session.login = null
    res.json({ code: 200, msg: '注销' })
  },

  /**
   * @api {post} api/memo/update 更新便签
   * @apiVersion 1.0.0
   * @apiGroup memo
   * @apiDescription 更新便签的json
   *
   * @apiUse needToken
   *
   * @apiParam {JSON} data 便签列表
   */
  updateMemo(req: any, res: any) {
    const userId: number = parseInt(check.user(req))
    if (!userId) {
      res.json({ code: 401, msg: '重新登录' })
      return
    }

    const json = req.body.data
    let query, arr

    query = 'UPDATE user SET memo=? WHERE id=?'
    arr = [JSON.stringify(json), userId]

    func.connPool(query, arr, async (rows: any) => {
      res.send({ code: 200, msg: 'ok' })
    })
  },

  /**
   * @api {get} api/memo/list 获取便签
   * @apiVersion 1.0.0
   * @apiGroup memo
   * @apiDescription 便签列表
   *
   * @apiUse needToken
   *
   */
  getListMemo(req: any, res: any) {
    const userId: number = parseInt(check.user(req))
    if (!userId) {
      res.json({ code: 401, msg: '重新登录' })
      return
    }
    func.connPool('SELECT memo from user where id = ?', [userId], (rows: any) => {
      rows = formatData(rows);
      res.json({ code: 200, msg: 'ok', result: JSON.parse(rows[0].memo) })
    })
  },

  // 权限控制
  // controlVisit(req, res, next) {
  //     if (req.session.login.role && req.session.login.role < 10) {
  //         res.json({ code: 400, msg: '权限不够' })
  //         return
  //     }

  //     next()
  // },

  // 权限变更
  // changeRole(req, res) {
  //     const role = req.session.login.role
  //     const change_role = req.body.change_role

  //     if (role !== 100 && change_role === 100) {
  //         res.json({ code: 400, msg: '权限不够' })
  //         return
  //     }

  //     const user_id = req.body.id

  //     func.connPool('UPDATE user SET role= ? WHERE id = ?', [change_role, user_id], rows => {
  //         console.log(rows)
  //         if (rows.affectedRows) {
  //             res.json({ code: 200, msg: 'done' })
  //         }
  //     })
  // }
}

export {}
