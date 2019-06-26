const {
    findPublicRecord
} = require('../models/chat');

const {
    dispose,
} = require('../utils/myFunction')

module.exports = async (ctx, next) => {
    const {
        userId,
        page,
    } = ctx.request.body;
    const limit = page * 15
    const res = await findPublicRecord(limit);
    if (res) {
        let record = dispose(res);
        record.map(item => {
            item.userId == userId ? item.isSelf = true : item.isSelf = false;
            item.chatTimestamp *= 1000
        })
        record.reverse(); //查询结果为倒序，翻转一下~~~
        ctx.body = {
            code: 1,
            msg: '查询成功',
            record,
        }
    } else {
        ctx.body = {
            code: 0,
            msg: '查询失败',
        }
    }
}