const {
    searchPrivateChat
} = require('../models/chat');

const {
    dispose
} = require('../utils/myFunction')

module.exports = async (ctx, next) => {
    const {
        userId: user_id,
        another_id,
        page,
    } = ctx.request.body;
    const limit = page * 15
    let chat = await searchPrivateChat({
        user_id,
        another_id,
        limit,
    });
    chat = dispose(chat);
    chat.map(item => {
        item.user_id == user_id ? item.isSelf = true : item.isSelf = false;
        item.chatTimestamp *= 1000
    })
    chat.reverse(); //查询结果为倒序，翻转一下~~~
    ctx.body = {
        code: 1,
        msg: '查询成功',
        chat,
    }
}