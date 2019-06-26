const {
    getUserChatList
} = require('../models/chat');

const {
    dispose
} = require('../utils/myFunction')

module.exports = async (ctx, next) => {
    const {
        userId,
    } = ctx.request.body;

    let chatList = await getUserChatList({
        userId,
    });
    chatList = dispose(chatList);
    ctx.body = {
        code: 1,
        msg: '修改成功',
        chatList,
    }
}