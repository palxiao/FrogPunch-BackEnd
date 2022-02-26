import { type } from "os";

const func = require('../../utils/mysql.ts');
const check = require('../../utils/check.ts')
module.exports = {
    getAll(params: any) {
        const userId: number = parseInt(check.user(params.token))
        if (!userId) { return }
        return new Promise(async resolve => {
            const target = await func.pConnPool('SELECT t.* FROM target t WHERE t.user_id= ?', [userId])
            const targetIds: Type.Object[] = []
            target.forEach((element: Type.Object) => {
                targetIds.push(element.id)
            });
            const event = await func.pConnPool(`SELECT te.*,r_e.NAME AS 'event_name' FROM target_event te INNER JOIN record_event r_e ON te.event_id=r_e.id WHERE te.target_id IN (${targetIds+''})`)
            const eventIds: Type.Object[] = []
            event.forEach((element: Type.Object) => {
                eventIds.push(element.event_id)
            });
            const queryType: Type.Object = {
                1: 'DATE(r.create_time) = CURDATE()',
                2: 'DATE_SUB(CURDATE(),INTERVAL 7 DAY) <= DATE(r.create_time)',
                3: `DATE_FORMAT(r.create_time,'%Y%m') = DATE_FORMAT(CURDATE(),'%Y%m')`
            }
            const rows = await func.pConnPool(`SELECT r.*,r_e.NAME AS 'event_name' FROM record r INNER JOIN record_event r_e ON r.event_id=r_e.id WHERE r.event_id IN (${eventIds+''}) AND ${queryType[params.type||1]}`)
            resolve(rows)
        })
    }
}

export { }
