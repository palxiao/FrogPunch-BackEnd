// const requireText = require('require-text');
// const Recordql = requireText('./record.gql', require)
const Recordql = require('./model.ts')
const service = require('./resolver.ts');
class Record {
    constructor() {

    }
    static Query: any = {
        /**
        * @api {get} graphql 获取当日记录详情
        * @apiName  getRecord
        * @apiVersion 1.0.0
        * @apiGroup record_gql
        * @apiSampleRequest off
        * 
        * @apiParam {String} token 用户验签
        * @apiParam {String} date 标准日期(eg: 2019-12-08)
        * @apiParam {String} format 如获取一个月记录: '%Y%m'，标准日期参数不变
        * 
        * @apiSuccess {Object} data 
        * @apiSuccess {Array} data.getRecord 返回该日期下的打卡记录
        * 
        * @apiUse RecordGetRecordModel
        */
        getRecord(parent: any, { params }: any, context: any) {
            return service.getAll(params)
        }
    }
}

module.exports = {
    Record, Recordql
}
export {
    Record, Recordql
}

