/**
 * Created by Administrator on 2019/2/22.
 */
import Vue from 'vue';
import Vuex from 'vuex';
import _http from '../http';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isNotBottom: true, //底部导航布尔值
    LOGO: null, //Logo 实例
    loading: false, //loading显示
    //Chat
    userInfo: '', //用户信息
    publicChat: '', //群聊
    //friend
    searchUserList: [], //搜索用户列表
    friendApply: [], //收到好友申请
    friendList: [], //好友列表
    sendApply: [], //自身发出的好友申请
  },
  getters: {},
  mutations: {
    setBottom(state, data) {
      state.isNotBottom = data;
    },
    loading(state, bool) {
      state.loading = bool;
    },
    setLogo(state, object) {
      state.LOGO = object;
    },
    setUserInfo(state, JSONFILE) {
      state.userInfo = JSONFILE;
    },
    setChat(state, record) {
      //处理每条聊天消息之间如果大于五分钟 则需要显示当条消息的时间
      if (record.length > 0) {
        record[0]['needTime'] = true;
        for (var i = 0; i < record.length; i++) {
          if (i + 1 >= record.length) {
            break;
          }
          record[i + 1]['chatTimestamp'] - record[i]['chatTimestamp'] > 180000 ?
            (record[i + 1]['needTime'] = true) :
            (record[i + 1]['needTime'] = false);
        }
        state.publicChat = record;
      } else {
        state.publicChat = '暂无聊天消息'
      }
    },
    updatePublicChat(state, record) {
      state.publicChat = [...state.publicChat, ...record];
    },
    setSearchUserList(state, friendJSON) {
      state.searchUserList = friendJSON;
    },
    setFriendList(state, alllist) {
      const friendApply = [];
      const friendList = [];
      const sendApply = [];
      alllist.map(item => {
        //收到了的好友申请
        if (item.hasFriendApply === 'has') {
          friendApply.push(item);
          return;
        }
        //已经有关系 但是不确定是否为好友
        if (item.hasFriendApply === 'not') {
          //双方都同意确定为好友
          if (item.isFriend === 'is') {
            friendList.push(item);
          } else {
            //自身发出的好友申请
            sendApply.push(item);
          }
          return;
        }
      });
      state.friendApply = friendApply;
      state.friendList = friendList;
      state.sendApply = sendApply;
    },
  },
  actions: {
    //查询用户好友
    GETFRIENDLIST: async ({
      commit
    }, DATA) => {
      const {
        data
      } = await _http.getFriendList();
      if (data.code === 1) {
        commit('setFriendList', data.friendList);
        return {
          bool: true,
        };
      } else {
        return {
          bool: false,
          msg: '获取好友失败，请刷新页面',
        };
      }
    },
  },
});
export default store;
