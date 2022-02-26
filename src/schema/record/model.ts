/**
* @apiDefine RecordGetRecordModel
* @apiParam (可选返回参数) {Number} id 记录ID
* @apiParam (可选返回参数) {String} event_name 事件名称
* @apiParam (可选返回参数) {Number} after_time 事件持续时间(毫秒)
* @apiParam (可选返回参数) {String} create_time 创建时间
*/
module.exports = `
type Record{
    id: Int
    event_name: String,
    create_time: String,
    after_time: Int
}

input recordParams {
    token: String,
    date: String,
    format: String
}
`