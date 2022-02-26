const TargetQL = require('./model.ts')
const TargetService = require('./resolver.ts');
class Target {
    constructor() {

    }
    static Query: any = {
        /**
        * @api {get} graphql 获取目标相关的打卡记录
        * @apiName  getTargetRecord
        * @apiVersion 1.0.0
        * @apiGroup target_gql
        * @apiSampleRequest off
        * 
        * @apiParam {String} token 用户验签
        * @apiParam {Number} type 1: 查今天, 2: 查一周 3: 查本月
        * 
        * @apiSuccess {Object} data 
        * 
        * @apiUse ReturnModel_TargetRecode
        */
       getTargetRecord(parent: any, { params }: any, context: any) {
            return TargetService.getAll(params)
        }
    }
}

module.exports = {
    Target, TargetQL
}
export {
    Target, TargetQL
}

