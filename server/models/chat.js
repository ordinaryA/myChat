const {
    query
} = require('../utils/db');

//连表查询群聊记录以及发送消息人信息
const findPublicRecord = limit => {
    const _sql = `SELECT 
                    a.userId,
                    a.chatMessage,
                    a.chatTimestamp,
                    b.username,
                    b.nickname,
                    b.avatar,
                    b.registerTime

                  FROM

                    publicchat AS a 
                    LEFT JOIN user AS b ON a.userId = b.userId 
                    ORDER BY chatId DESC LIMIT ${limit}`
    return query(_sql)
}

//发送群聊消息
const sendPublicMessage = object => {
    const {
        userId,
        chatMessage,
        chatTimestamp
    } = object;
    const _sql = `INSERT INTO publicchat(userId,chatMessage,chatTimestamp) VALUES ('${userId}','${chatMessage}','${chatTimestamp}')`
    return query(_sql)
}
//获取用户的聊天列表
const getUserChatList = object => {
    const {
        userId,
    } = object;
    const _sql = `SELECT 
                    b.nickname,
                    b.avatar,
                    a.*

                  FROM
                  
                    chat_list AS a 
                    LEFT JOIN user AS b ON a.another_id = b.userId 
                    WHERE a.user_id = '${userId}'
                    ORDER BY id`
    return query(_sql)
}

//根据双方ID查询是否有聊天关系
const searchHaveChat = req => {
    const {
        userId,
        anotherId
    } = req;
    const _sql = `SELECT * from chat_master WHERE (user_id='${userId}' AND another_id='${anotherId}') or (another_id='${userId}' AND user_id='${anotherId}') LIMIT 1`
    return query(_sql)
}

//不存在聊天关系主表插入关系
const creatChatMaster = req => {
    const {
        userId,
        anotherId,
    } = req;
    const _sql = `INSERT INTO chat_master(user_id,another_id) VALUES ('${userId}','${anotherId}')`
    return query(_sql)
}

//如果不存在聊天关系则插入新关系到聊天列表
const creatChatIntoList = req => {
    const {
        userId,
        anotherId,
        chatId,
        type,
    } = req;
    let sql = '';
    if (type == 'self') {
        _sql = `INSERT INTO chat_list(chat_id,user_id,another_id,is_online,unread,del_status,last_chat) VALUES ('${chatId}','${userId}','${anotherId}',0,0,0,'')`
    }
    if (type == 'another') {
        _sql = `INSERT INTO chat_list(chat_id,user_id,another_id,is_online,unread,del_status,last_chat) VALUES ('${chatId}','${anotherId}','${userId}',0,0,0,'')`
    }
    return query(_sql)
}

//查询用户之间的聊天记录
const searchPrivateChat = req => {
    const {
        user_id,
        another_id,
        limit,
    } = req;
    const _sql = `SELECT 
                   b.nickname,
                   b.avatar,
                   a.*
                
                 FROM
                 
                   chat_detail AS a 
                   LEFT JOIN user AS b ON a.user_id = b.userId 
                   WHERE (user_id='${user_id}' AND another_id='${another_id}') OR (user_id='${another_id}' AND another_id='${user_id}')
                   ORDER BY id DESC LIMIT ${limit}`
    return query(_sql)
}

//根据id查询聊天关系id
const getChatIdbyId = req => {
    const {
        id
    } = req;
    const _sql = `SELECT chat_id from chat_list WHERE id='${id}' LIMIT 1`
    return query(_sql)
}

//发送私聊信息
const insertPrivateChat = req => {
    const {
        user_id,
        another_id,
        chat_id,
        content,
        chatTimestamp,
        type
    } = req;
    const _sql = `INSERT INTO 
                    chat_detail(chat_id,user_id,another_id,content,chatTimestamp,type,is_last)
                    VALUES 
                    ('${chat_id}','${user_id}','${another_id}','${content}','${chatTimestamp}','${type}',1)`
    return query(_sql)
}

//用户进入聊天框内时，修改用户为在线状态
const userIsOnline = req => {
    let {
        id,
        type,
    } = req;
    if (type == 'online') {
        let _sql = `UPDATE chat_list SET is_online=${1},unread=${0} WHERE id='${id}' LIMIT 1`
        return query(_sql, req)
    } else if (type == 'exit') {
        let _sql = `UPDATE chat_list SET is_online=${0} WHERE id='${id}' LIMIT 1`
        return query(_sql, req)
    }
}

//查询对方是否在线
const searchIsOnline = req => {
    let {
        user_id,
        another_id,
        chat_id,
    } = req;
    const _sql = `SELECT is_online from chat_list WHERE user_id='${another_id}' AND another_id='${user_id}' AND chat_id='${chat_id}' LIMIT 1`
    return query(_sql, req)
}

//对方未读数加1
const updateAnotherUnread = req => {
    let {
        user_id,
        another_id,
        chat_id,
        content,
        unreadAddOne,
    } = req;
    if (unreadAddOne == 1) {
        const _sql = `UPDATE chat_list SET unread=unread+1,last_chat='${content}'  WHERE user_id='${another_id}' AND another_id='${user_id}' AND chat_id='${chat_id}' LIMIT 1`
        return query(_sql, req)
    } else {
        const _sql = `UPDATE chat_list SET last_chat='${content}'  WHERE user_id='${another_id}' AND another_id='${user_id}' AND chat_id='${chat_id}' LIMIT 1`
        return query(_sql, req)
    }
}

module.exports = {
    sendPublicMessage,
    searchHaveChat,
    creatChatMaster,
    creatChatIntoList,
    getUserChatList,
    findPublicRecord,
    searchPrivateChat,
    getChatIdbyId,
    insertPrivateChat,
    userIsOnline,
    searchIsOnline,
    updateAnotherUnread,
}