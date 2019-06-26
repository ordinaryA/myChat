const {
    searchHaveChat,
    creatChatMaster,
    creatChatIntoList,
    getChatIdbyId,
} = require('../models/chat');

const {
    dispose,
} = require('../utils/myFunction')

module.exports = async (ctx, next) => {
    let {
        userId,
        anotherId,
    } = ctx.request.body;
    userId *= 1;

    let res = await searchHaveChat({
        userId,
        anotherId
    });
    res = dispose(res)
    if (res.length > 0) {
        ctx.body = {
            code: 1,
            tip: 'has',
            msg: '已存在聊天关系',
            chatInfo: res,
        }
    } else {
        let creMaster = await creatChatMaster({
            userId,
            anotherId
        });
        const {
            insertId: chatId
        } = dispose(creMaster);
        await creatChatIntoList({
            userId,
            anotherId,
            chatId,
            type: 'self'
        });
        let getId = await creatChatIntoList({
            userId,
            anotherId,
            chatId,
            type: 'another'
        });
        getId = dispose(getId);
        let getChatId = await getChatIdbyId({
            id: getId.insertId
        });
        getChatId = dispose(getChatId)[0].chat_id;
        ctx.body = {
            code: 1,
            msg: '新增聊天关系成功',
            tip: 'newCreate',
            chat_id: getChatId,
        }
    }
}