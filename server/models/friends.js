const {
    query
} = require('../utils/db');



//根据字段查询用户昵称和用户名获取用户信息
const searchUser = str => {
    const _sql = `SELECT userId,username,nickname,avatar,registerTime FROM user WHERE username='${str}' or nickname='${str}'`
    return query(_sql)
}

//获取用户ID查询的好友关系列表
const getFriendList = myId => {
    const _sql = `SELECT * FROM friend WHERE fromUserId='${myId}' or toUserId='${myId}'`
    return query(_sql)
}

//根据用户ID集合查询用户
const getUserInfoByIdArray = arr => {
    const _sql = `SELECT userId,username,nickname,avatar,registerTime FROM user WHERE userId IN ${arr}`
    return query(_sql)
}

//根据双方ID查询是否为好友
const searchIsFriend = req => {
    const {
        applyUser,
        receiveUser
    } = req;
    const _sql = `SELECT * from friend WHERE (fromUserId='${applyUser}' AND toUserId='${receiveUser}') or(fromUserId='${receiveUser}' AND toUserId='${applyUser}')`
    return query(_sql)
}

//双方不是好友时插入一条好友关系
const insertWhenIsNotFriend = req => {
    const {
        applyUser,
        receiveUser
    } = req;
    const _sql = `INSERT INTO friend(fromUserId,toUserId,fromUserBool,toUserBool,firstDate) VALUES ('${applyUser}','${receiveUser}',1,0,0)`
    return query(_sql)
}

//接受好友请求，成为好友
const confirmRequest = req => {
    const {
        applyId,
        selfId,
        firstDate,
    } = req;
    const _sql = `UPDATE friend SET toUserBool=1,firstDate=${firstDate} WHERE fromUserId='${applyId}' AND toUserId='${selfId}'`
    return query(_sql)
}

//拒绝好友请求，删除关系
const refuseRequest = req => {
    const {
        applyId,
        selfId,
    } = req;
    const _sql = `DELETE FROM friend WHERE fromUserId='${applyId}' AND toUserId='${selfId}'`
    return query(_sql)
}


module.exports = {
    searchUser,
    getFriendList,
    getUserInfoByIdArray,
    searchIsFriend,
    insertWhenIsNotFriend,
    confirmRequest,
    refuseRequest,
}