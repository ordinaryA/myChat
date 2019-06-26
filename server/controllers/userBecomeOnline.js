const {
    userIsOnline
} = require('../models/chat');

const {
    dispose
} = require('../utils/myFunction')

module.exports = async (ctx, next) => {
    let {
        id,
        type
    } = ctx.request.body;
    const res = await userIsOnline({
        id,
        type,
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