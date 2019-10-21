
<template>
  <div class="com_layout">
    <mu-appbar class="com_header">{{title}}</mu-appbar>
    <mu-list class="border_box h80">
      <mu-sub-header>群聊天</mu-sub-header>
      <div v-for="(i,idx) in mockChat" :key="idx">
        <mu-list-item avatar button class="list_one" :to="i.room">
          <mu-list-item-action>
            <mu-avatar>
              <img :src="i.ava" />
            </mu-avatar>
          </mu-list-item-action>
          <mu-list-item-content>
            <mu-list-item-title>{{i.title}}</mu-list-item-title>
            <mu-list-item-sub-title>{{i.message}}</mu-list-item-sub-title>
          </mu-list-item-content>
          <mu-list-item-action>
            <mu-list-item-after-text>15 min</mu-list-item-after-text>
            <mu-list-item-after-text></mu-list-item-after-text>
          </mu-list-item-action>
        </mu-list-item>
        <mu-divider inset />
      </div>
      <mu-sub-header>好友聊天</mu-sub-header>
      <div v-if="chatList.length == 0" class="have_not_friend">暂无好友，请到通讯录页面添加好友♪(＾∀＾●)ﾉ</div>
      <div v-for="i in chatList" :key="i.id">
        <mu-list-item avatar button class="list_one" @click="goRoom2(i)">
          <mu-list-item-action>
            <mu-avatar>
              <img :src="`./static/avatar/${i.avatar}`" />
            </mu-avatar>
          </mu-list-item-action>
          <mu-list-item-content>
            <mu-list-item-title>{{i.nickname}}</mu-list-item-title>
            <mu-list-item-sub-title>{{i.last_chat}}</mu-list-item-sub-title>
          </mu-list-item-content>
          <mu-list-item-action v-if="i.unread != 0">
            <mu-badge :content="String(i.unread)" color="secondary" circle></mu-badge>
          </mu-list-item-action>
        </mu-list-item>
        <mu-divider inset />
      </div>
    </mu-list>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  DEL_LOGO,
  COMMIT,
  GET_SESSION,
  PUSH,
  DISPATCH,
  SET_SESSION
} from "../../utils";
import _http from "../../http";
import SOCKET from "../../utils/socket.js";
export default {
  data() {
    return {
      title: "MyChat",
      mockChat: [
        {
          ava: "./static/avatar/ava_2.jpg",
          title: `That's All!`,
          message: "emmm 测试中...",
          room: "/room"
        }
      ]
    };
  },
  computed: {
    ...mapState(["LOGO", "chatList"])
  },
  created() {
    this.init();
    this.buildSocket();
  },
  mounted() {
    // this.initBind();
  },
  methods: {
    /**
     * 初始化页面
     * @param {null}
     * @return {void}
     */
    async init() {
      DEL_LOGO(this);
      COMMIT("setBottom", true);
      this.requestUserInfo();
      this.requestChatList();
    },

    /**
     * 请求用户数据
     * @param {null}
     * @return {void}
     */
    async requestUserInfo() {
      const { data } = await _http.getUserInfo();
      if (data.code === 1) {
        COMMIT("setUserInfo", data.userInfo);
      } else {
        this.$toast.error("连接失败，请刷新页面");
      }
    },

    /**
     * 请求聊天列表数据
     * @param {null}
     * @return {void}
     */
    async requestChatList() {
      const { data } = await _http.getChatList();
      if (data.code === 1) {
        COMMIT("setChatList", data.chatList);
      } else {
        this.$toast.error("连接失败，请刷新页面");
      }
    },

    /**
     * DOM树构建完后绑定事件
     * @param {null}
     * @return {void}
     */
    // initBind() {

    // },

    /**
     * 建立SOCKET链接
     * @param {null}
     * @return {void}
     */
    buildSocket() {
      SOCKET.on("Update_Private_Chat", async socketInfo => {
        const userId = JSON.parse(GET_SESSION("USERID"));
        if (userId == socketInfo.another_id) {
          const { data } = await _http.getChatList();
          if (data.code == 1) {
            COMMIT("setChatList", data.chatList);
          }
        }
      });
    },

    /**
     * 点击消息列表进入聊天
     * @param {Object}
     * @return {void}
     */
    async goRoom2(object) {
      SET_SESSION("ANOTHER_USER_INFO", JSON.stringify(object));
      PUSH("/room2");
    }
  }
};
</script>

<style scoped>
.have_not_friend {
  text-align: center;
  color: #666;
  font-size: 14px;
}
</style>