const {
    getFriendList,
    getUserInfoByIdArray,
} = require('../models/friends');

const {
    dispose,
} = require('../utils/myFunction')

module.exports = async (ctx, next) => {
    let {
        userId
    } = ctx.request.body;
    userId *= 1;
    let res = await getFriendList(userId);
    res = dispose(res);
    if (res.length === 0) {
        ctx.body = {
            code: 1,
            friendList: [],
            msg: '查询成功',
        }
        return
    }
    let sel = '('; //获取好友ID字符串
    const makeFriend = []; //成为好友

    res.map(item => {
        //我是主动加好友的一方
        if (item.fromUserId == userId) {
            //用户集合里的搜索条件
            sel = sel + item.toUserId + ','
            //记录目前有多少条跟用户之间的关系
            makeFriend.push({
                userId: item.toUserId, //另一个用户
                firstDate: item.firstDate * 1000, //成为好友的时间
                hasFriendApply: 'not', //如果自己是发送申请的人则不显示好友申请
                isFriend: item.toUserBool ? 'is' : 'not', //是否已经是好友
            })
            return
        }
        //我是被人加好友的一方
        if (item.toUserId == userId) {
            sel = sel + item.fromUserId + ','
            makeFriend.push({
                userId: item.fromUserId,
                firstDate: item.firstDate * 1000,
                hasFriendApply: item.toUserBool ? 'not' : 'has', //是否有未处理的好友申请
                isFriend: item.toUserBool ? 'is' : 'not', //是否已经是好友
            })
            return
        }
    })
    sel = sel.substring(0, sel.length - 1) + ')';
    const userArray = await getUserInfoByIdArray(sel);
    const resUser = dispose(userArray)

    //break提前结束遍历
    for (let i = 0; i < resUser.length; i++) {
        const item = resUser[i];
        item.registerTime *= 1000;
        for (let n = 0; n < makeFriend.length; n++) {
            const child = makeFriend[n];
            if (item.userId == child.userId) {
                item.firstDate = child.firstDate;
                item.hasFriendApply = child.hasFriendApply;
                item.isFriend = child.isFriend;
                break;
            }
        }
    }

    ctx.body = {
        code: 1,
        friendList: resUser,
        msg: '查询成功',
    }
}