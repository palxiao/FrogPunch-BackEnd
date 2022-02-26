// const requireText = require('require-text');
// const Noteql = requireText('./note.gql', require)
const Noteql = require('./model.ts')
const service = require('./resolver.ts');

class Note {
    constructor() {

    }
    static Query: any = {
        /**
        * @api {get} graphql 获取记事 列表
        * @apiName getNote
        * @apiVersion 1.0.0
        * @apiGroup note_gql
        * @apiDescription 获取某一年份下全部记事信息
        * @apiSampleRequest off
        * 
        * @apiParam {String} token 用户验签
        * @apiParam {String} year 请求某一个年份的数据
        * 
        * @apiSuccess {Object} data
        * @apiSuccess {Array} data.getNote 返回该年份下的所有记事
        * 
        * @apiUse NoteGetNoteModel
        */
        getNote(parent: any, { params }: any, context: any) {
            return service.getAll(params)
        }
    }
}

module.exports = {
    Note, Noteql
}
export { }
