let path = '/api';

module.exports = {
    // 标签 record_event
    eventList: path + '/event/list',
    eventAdd: path + '/event/add',
    eventDelete: path + '/event/delete',
    // 打卡记录 record
    getRecord: path + '/record/list',
    getRecordOne: path + '/record/one',
    addRecord: path + '/record/add',
    recordDelete: path + '/record/delete',
    // 记事本 note
    noteList: path + '/note/list',
    noteDetail: path + '/note/detail',
    noteDelete: path + '/note/delete',
    noteAdd: path + '/note/add',
    noteDeleteMulti: path + '/note/delete-multi',
    noteUploadImg: path + '/note/upload-img',

    // user
    userList: path + '/user/list',
    userDelete: path + '/user/delete',
    userAdd: path + '/user/add',
    userDeleteMulti: path + '/user/delete-multi',
    userLogin: path + '/user/login',
    userLogout: path + '/user/logout',
    userAutoLogin: path + '/user/auto-login',
    // userChangeRole: path + '/user/change-role',
    userFingerLogin: path + '/user/fingerLogin',
    userFingerRegister: path + '/user/fingerRegister',
    userBindFinger: path + '/user/bindFinger',
    userGetOne: path + '/user/get',
    userUpdate: path + '/user/update',

    // 目标管理 target
    targetList: path + '/target/list',
    targetAdd: path + '/target/addUpdate',
    targetDelete: path + '/target/delete',
    targetBindEvent: path + '/target/bind_event',
    targetDeleteEvent: path + '/target/delete_event',

    // 目标预设
    presetList: path + '/preset/list',
    presetAdd: path + '/preset/addUpdate',
    presetDelete: path + '/preset/delete',
    
    // 其他
    auditSwitch: '/mp/audit',
    yanyeMakingData: '/mp/yanye/makingData',
    POST_YAN_YE_ADD: '/mp/yanye/addData',
    POST_SEND_MP_MESSAGE: '/mp/sendSubscribe',

    // 便签
    POST_MEMO_UPDATE: path + '/memo/update',
    GET_MEMO_LIST: path + '/memo/list',
};
