/*
 * @Author: ShawnPhang
 * @Date: 2021-08-22 23:07:48
 * @Description: 
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-11-11 14:30:02
 * @site: book.palxp.com / blog.palxp.com
 */
/**
 *   0 本地数据库   1 线上数据库
 */
//  const isProduction = process.env.NODE_ENV === 'production'
const switchOne: number = 1

const _config = require('../config.json')

const dbs = [
    {
        host: 'localhost',
        port: 3306,
        user: '',
        password: '',
        database: ''
    }, {
        host: '${host}',
        port: 3306,
        user: '${user}',
        password: '${password}',
        database: 'frog_punch'
    }
]

dbs[1] = _config || dbs[1]

exports.db = dbs[switchOne]