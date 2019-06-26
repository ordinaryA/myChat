const {
    findInfoById
} = require('../models/user_info');

const {
    dispose,
    returnTime,
} = require('../utils/myFunction')

module.exports = async (ctx, next) => {
    const {
        userId
    } = ctx.request.body;

    const res = await findInfoById(userId);
    const userInfo = dispose(res);
    returnTime(userInfo, 'registerTime')
    if (userInfo.length > 0) {
        ctx.body = {
            code: 1,
            msg: '查询成功',
            userInfo: userInfo[0],
        }
    } else {
        ctx.body = {
            code: 0,
            msg: '查询失败',
        }
    }
}