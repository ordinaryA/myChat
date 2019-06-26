const router = require('koa-router')();
const baseApi = require('../config').baseApi;

router.prefix(`/${baseApi}`)
router.get('/test', () => console.log('test')) //测试

const API = [
    'register', //注册
    'login', //登录
    'getUserInfo', //查询用户个人信息
    'getPublicChat', //群聊聊天记录
    'sendPublicChat', //发送群聊天消息
    'changeAvatar', //修改我的头像
    'changeNickname', //修改我的头像
    'searchUser', //根据用户名或昵称搜索其他用户
    'getFriendList', //获取用户的好友列表
    'makeFriend', //发起添加好友
    'disposeApply', //处理好友请求
    'createChat', //生成聊天关系
    'getChatList', //获取用户聊天列表
    'getPrivateChat', //获取用户聊天列表
    'sendPrivateChat', //用户之间发送消息
    'userBecomeOnline', //更改用户在会话中的在线状态
]

API.map(url => router.post('/' + url, require('../controllers/' + url)));

module.exports = router