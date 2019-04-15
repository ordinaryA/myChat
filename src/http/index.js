import req from 'axios'
import {
  GET_SESSION
} from '../utils'
import {
  API
} from '../_config/des'

const url = base => API + base;
const RESDATA = data => ({
  ...data,
  userId: GET_SESSION('USERID') * 1,
})

const _http = {};

const service = [
  //注册接口
  'register',
  //登录接口
  'login',
  //获取自身个人资料
  'getUserInfo',
  //获取聊天记录
  'getPublicChat',
  //发送群聊天信息
  'sendPublicChat',
  //更改头像
  'changeAvatar',
  //修改昵称
  'changeNickname',
  //查询用户
  'searchUser',
  //获取用户好友列表
  'getFriendList',
  //发送好友申请
  'makeFriend',
  //处理好友申请
  'disposeApply',
  //发起好友聊天
  'createChat',
  //获取用户的消息列表
  'getChatList',
  //获取两个用户之间的聊天记录
  'getPrivateChat',
  // 待处理......
  //发送私聊信息
  'sendPrivateChat',
]

service.map(i => _http[i] = data => req.post(url('/' + i), RESDATA(data)));

export default _http
