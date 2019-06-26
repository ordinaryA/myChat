const {
    changeNickname
} = require('../models/user_info');

const {
    dispose
} = require('../utils/myFunction')

module.exports = async (ctx, next) => {
    let {
        userId: id,
        nickname,
    } = ctx.request.body;
    id *= 1;
    const res = await changeNickname({
        id,
        nickname
    });
    const {
        affectedRows
    } = dispose(res);
    if (affectedRows > 0) {
        ctx.body = {
            code: 1,
            msg: '修改成功',
        }
    } else {
        ctx.body = {
            code: 0,
            msg: '网络不佳，请刷新后再试',
        }
    }

}