const {
    searchUser
} = require('../models/friends');

const {
    dispose,
    returnTime,
} = require('../utils/myFunction')

module.exports = async (ctx, next) => {
    let {
        str,
    } = ctx.request.body;
    let res = await searchUser(str);
    res = dispose(res);
    returnTime(res, 'registerTime');
    if (!res) {
        ctx.body = {
            code: 0,
            msg: '网络不佳，请刷新后再试',
        }
        return
    }
    if (res.length > 0) {
        ctx.body = {
            code: 1,
            msg: '查询成功',
            userList: res,
        }
    } else {
        ctx.body = {
            code: 1,
            msg: '此用户不存在',
            userList: [],
        }
    }
}