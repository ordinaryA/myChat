const {
    searchIsFriend,
    insertWhenIsNotFriend,
} = require('../models/friends');

const {
    dispose,
} = require('../utils/myFunction')

module.exports = async (ctx, next) => {
    let {
        applyUser,
        receiveUser,
    } = ctx.request.body;
    applyUser *= 1;
    receiveUser *= 1;
    let searchRes = await searchIsFriend({
        applyUser,
        receiveUser
    });
    searchRes = dispose(searchRes);
    if (searchRes.length > 0) {
        const {
            fromUserBool,
            toUserBool,
        } = searchRes[0];
        if (fromUserBool == 1 && toUserBool == 1) {
            ctx.body = {
                code: 1,
                msg: '你们已经是好友了',
            }
            return
        }
    } else {
        let res = await insertWhenIsNotFriend({
            applyUser,
            receiveUser
        })
        const {
            affectedRows
        } = dispose(res);
        if (affectedRows > 0) {
            ctx.body = {
                code: 1,
                msg: "已发送好友申请",
            }
        } else {
            ctx.body = {
                code: 0,
                msg: "网络不佳，请刷新后再试",
            }
        }
    }
}