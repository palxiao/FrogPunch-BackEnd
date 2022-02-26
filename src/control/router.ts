const rExpress = require('express');
const note = require('../service/note.ts');
const mevent = require('../service/event.ts');
const record = require('../service/record.ts');
const user = require('../service/user.ts');
const target = require('../service/target.ts');
const preset = require('../service/preset.ts');
const mPyanye = require('../service/MiniProgram/yanye.ts');
const miniProgram = require('../service/MiniProgram/message.ts');
const api = require('./api.ts');
// const rUpload = require('../utils/upload');

const rRouter = rExpress.Router();

// note
rRouter.get(api.noteList, note.fetchAll);
// rRouter.post(api.noteDetail, note.fetchById);
rRouter.post(api.noteAdd, note.addOne);
rRouter.post(api.noteDelete, note.deleteOne);
// rRouter.post(api.goodsDeleteMulti, goods.deleteMulti);
// rRouter.post(api.goodsUploadImg, rUpload.single('avatar'), goods.uploadGoodsImg); // 图片上传

// user
rRouter.get(api.userList, user.fetchAll); // 获取全部 列表
rRouter.get(api.userLogout, user.logout); // 退出登录
rRouter.get(api.userAutoLogin, user.autoLogin); // 自动登录

rRouter.post(api.userAdd, user.addOne); // 添加用户
rRouter.post(api.userDelete, user.deleteOne); // 删除用户
rRouter.post(api.userDeleteMulti, user.deleteMulti);
rRouter.post(api.userLogin, user.login); // 登录
rRouter.post(api.userFingerLogin, user.fingerLogin) // 指纹登录
rRouter.post(api.userFingerRegister, user.fingerRegister) // 指纹注册
rRouter.post(api.userBindFinger, user.bindFinger) // 绑定浏览器
rRouter.get(api.userGetOne, user.getOne) // 获取用户
rRouter.post(api.userUpdate, user.updateUser) // 更新用户

// record_event
rRouter.get(api.eventList, mevent.fetchAll)
rRouter.post(api.eventAdd, mevent.addOne)
rRouter.post(api.eventDelete, mevent.deleteOne)
// record
rRouter.get(api.getRecord, record.fetchAll)
rRouter.get(api.getRecordOne, record.fetchOne)
rRouter.post(api.addRecord, record.addOne)
rRouter.post(api.recordDelete, record.deleteOne)

// 目标管理 target
rRouter.get(api.targetList, target.fetchAll)
rRouter.post(api.targetAdd, target.addUpdateOne)
rRouter.post(api.targetDelete, target.deleteOne)
rRouter.post(api.targetBindEvent, target.bindEvent)
rRouter.post(api.targetDeleteEvent, target.deleteEvent)

// 预设 preset
rRouter.get(api.presetList, preset.fetchAll)
rRouter.post(api.presetAdd, preset.addUpdateOne)
rRouter.post(api.presetDelete, preset.deleteOne)

// others
rRouter.get(api.auditSwitch, mPyanye.audit)
rRouter.get(api.yanyeMakingData, mPyanye.makingData)
rRouter.post(api.POST_YAN_YE_ADD, mPyanye.addData)
rRouter.post(api.POST_SEND_MP_MESSAGE, miniProgram.sendSubscribe)

// memo
rRouter.post(api.POST_MEMO_UPDATE, user.updateMemo) // 更新便签
rRouter.get(api.GET_MEMO_LIST, user.getListMemo) // 更新便签

module.exports = rRouter;

export default rRouter;
