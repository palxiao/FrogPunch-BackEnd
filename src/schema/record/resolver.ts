const func = require('../../utils/mysql.ts');
const check = require('../../utils/check.ts')
module.exports = {
    getAll(params: any) {
        const userId: number = parseInt(check.user(params.token))
        if (!userId) { return }
        let theDate = params.date ? params.date : new Date()
        let format = params.format ? params.format : '%Y-%m-%d'
        return new Promise((resolve) => {
            const query = `SELECT r.*,r_e.NAME AS 'event_name' FROM record r INNER JOIN record_event r_e ON r.event_id=r_e.id WHERE r.user_id=? AND DATE_FORMAT(r.create_time,'${format}')=DATE_FORMAT(?,'${format}')`
            func.connPool(query, [userId, theDate], (rows: any) => {
                resolve(rows)
            });
        })
    }
}

export { }
