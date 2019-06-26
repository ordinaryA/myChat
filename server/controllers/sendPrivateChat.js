const {
    insertPrivateChat,
    searchIsOnline,
    updateAnotherUnread,
} = require('../models/chat');

const {
    dispose,
    momentTime,
} = require('../utils/myFunction')

module.exports = async (ctx, next) => {
    const {
        userId: user_id,
        another_id,
        chat_id,
        content,
        type,
    } = ctx.request.body;
    const chatTimestamp = momentTime();
    let res = await insertPrivateChat({
        user_id,
        another_id,
        chat_id,
        content,
        chatTimestamp,
        type,
    })
    res = dispose(res).affectedRows;
    if (res > 0) {
        let on = await searchIsOnline({
            user_id,
            another_id,
            chat_id,
        })
        let unreadAddOne = 0;
        if (dispose(on)[0].is_online == 0) {
            unreadAddOne = 1;
        }
        //不在线时对方未读加1
        let unread = await updateAnotherUnread({
            user_id,
            another_id,
            chat_id,
            unreadAddOne,
            content,
        })
        unread = dispose(unread).affectedRows;
        if (unread > 0) {
            ctx.body = {
                code: 1,
                msg: '发送成功',
            }
        } else {
            ctx.body = {
                code: 0,
                msg: '网络不佳，请刷新后再试',
            }
        }
    } else {
        ctx.body = {
            code: 0,
            msg: '网络不佳，请刷新后再试',
        }
    }

}