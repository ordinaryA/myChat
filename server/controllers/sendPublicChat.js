const {
    sendPublicMessage
} = require('../models/chat')
const {
    dispose,
    momentTime,
} = require('../utils/myFunction')

module.exports = async (ctx, next) => {
    let {
        chatMessage,
        userId,
    } = ctx.request.body;
    userId *= 1;
    const chatTimestamp = momentTime();
    const res = await sendPublicMessage({
        userId,
        chatMessage,
        chatTimestamp
    });
    const {
        affectedRows
    } = dispose(res)
    if (affectedRows > 0) {
        ctx.body = {
            code: 1,
            msg: "发送成功",
        }
    } else {
        ctx.body = {
            code: 0,
            msg: "网络不佳，发送失败",
        }
    }
};