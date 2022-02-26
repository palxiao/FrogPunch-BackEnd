/**
* @apiDefine NoteGetNoteModel
* @apiParam (可选返回参数) {Number} Id Id
* @apiParam (可选返回参数) {String} text 记事内容
* @apiParam (可选返回参数) {String} create_time 创建时间(标准时间)
* @apiParam (可选返回参数) {String} update_time 更新时间
*/
module.exports = `
type Note{
    id: Int
    text: String,
    create_time: String,
    update_time: String
}

input noteParams {
    token: String,
    year: String
}
`