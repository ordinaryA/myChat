const {
    confirmRequest,
    refuseRequest,
} = require('../models/friends');

const {
    dispose,
    momentTime,
} = require('../utils/myFunction')

module.exports = async (ctx, next) => {
    let {
        type,
        applyId,
        selfId,
    } = ctx.request.body;
    applyId *= 1;
    selfId *= 1;

    if (type === 'accept') {
        let res = await confirmRequest({
            applyId,
            selfId,
            firstDate: momentTime(),
        });
        res = dispose(res);
        const {
            affectedRows
        } = res;
        if (affectedRows > 0) {
            ctx.body = {
                code: 1,
                msg: '恭喜你们成为了好友',
            }
        } else {
            ctx.body = {
                code: 0,
                msg: '添加失败，请重新添加',
            }
        }
        return
    }
    if (type === 'refuse') {
        let res = await refuseRequest({
            applyId,
            selfId,
        });
        res = dispose(res);
        const {
            affectedRows
        } = res;
        if (affectedRows > 0) {
            ctx.body = {
                code: 1,
                msg: '已拒绝',
            }
        } else {
            ctx.body = {
                code: 0,
                msg: '网络不佳，请刷新后再试',
            }
        }
        return
    }

}