/**
* @apiDefine ReturnModel_TargetRecode
* @apiParam (可选返回参数) {Number} id 记录ID
* @apiParam (可选返回参数) {String} event_name 事件名称
* @apiParam (可选返回参数) {Number} event_id 事件ID
* @apiParam (可选返回参数) {Number} after_time 事件持续时间(毫秒)
* @apiParam (可选返回参数) {String} create_time 创建时间
* @apiParam (可选返回参数) {Number} is_done 是否完成 0未完成 1已完成
*/
module.exports = `
type TargetRecord{
    id: Int
    event_name: String,
    event_id: String,
    create_time: String,
    after_time: Int,
    is_done: Int
}

input targetRecordParams {
    token: String,
    type: String
}
`