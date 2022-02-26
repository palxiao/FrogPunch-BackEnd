const func = require('../../utils/mysql.ts')
const check = require('../../utils/check.ts')
const moment = require('moment')
module.exports = {
    getAll(params: any) {
        const userId: number = parseInt(check.user(params.token))
        if (!userId) { return }
        let theYear = params.year ? params.year : moment().format('YYYY')
        return new Promise((resolve) => {
            const query = "SELECT*FROM note n WHERE n.user_id=? AND DATE_FORMAT(n.create_time,'%Y')=? ORDER BY create_time desc"
            func.connPool(query, [userId, theYear], (rows: any) => {
                resolve(rows.map((row: any) => {
                    let date = moment(row.create_time).format('YYYY-MM-DD HH:mm:ss');
                    return Object.assign({}, row, { create_time: date });
                }))
            });
        })
    }
}

export { }
