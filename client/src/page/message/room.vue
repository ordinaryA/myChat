<template>
  <div class="dise">
    <mu-appbar class="room_bar">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value=":iconfont icon-back" />
      </mu-button>
      <span class="room_name">That's All</span>
      <mu-button icon slot="right">
        <mu-icon value=":iconfont icon-more" />
      </mu-button>
    </mu-appbar>
    <div class="msg_box" ref="msgBox" @scroll.passive="loadData()">
      <div class="msg_one cl" v-for="(item,i) in publicChat" :key="i">
        <div v-if="item.needTime" class="msg_time">
          <span>{{changeDate(item.chatTimestamp,true)}}</span>
        </div>
        <mu-avatar :class="item.isSelf ? 'self_avatar' : 'other_avatar'">
          <img :src="`./static/avatar/${item.avatar}`" alt />
        </mu-avatar>
        <div>
          <div :class="item.isSelf ? 'self_title' : 'other_title'">{{item.nickname}}</div>
          <div :class="item.isSelf ? 'self_msg' : 'other_msg'">{{item.chatMessage}}</div>
        </div>
      </div>
    </div>
    <div class="enter_box">
      <input class="input_box" type="text" ref="userMsg" v-model="willChat" maxlength="85" />
      <mu-button class="sendBtn" color="primary" @click="sendMessage">
        发送
        <mu-icon right value="send"></mu-icon>
      </mu-button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { COMMIT, GET_SESSION, TRIM } from "../../utils";
import _http from "../../http";
import { recentDate } from "../../utils/date.js";
import SOCKET from "../../utils/socket.js";

export default {
  data() {
    return {
      viewBox: null,
      page: 1,
      timer: null,
      willChat: ""
    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.initBind();
  },
  methods: {
    /**
     * 页面初始化
     * @param {Null}
     * @return {Null}
     */
    async init() {
      COMMIT("setBottom", false);
      const { data } = await _http.getPublicChat({ page: this.page });
      if (data.code === 1) {
        COMMIT("setChat", data.record);
        this.$nextTick(() => {
          this.$refs.msgBox.scrollTop = this.$refs.msgBox.scrollHeight;
        });
      } else {
        this.$toast.error("网络不佳，请刷新页面");
        return;
      }
    },

    /**
     * Dom建立后绑定事件和socket
     * @param {Null}
     * @return {Null}
     */
    async initBind() {
      const _this = this;
      this.$refs.userMsg.onkeydown = event => {
        event.keyCode === 13 ? _this.sendMessage() : null;
      };
      SOCKET.on("sendSuccess", async () => {
        const { data } = await _http.getPublicChat({ page: 1 });
        COMMIT("updatePublicChat", data.record);
        this.$nextTick(() => {
          if (this.$refs.msgBox) {
            this.$refs.msgBox.scrollTop = this.$refs.msgBox.scrollHeight;
          }
        });
      });
    },

    /**
     * 返回上一级
     * @param {Null}
     * @return {Null}
     */
    goBack() {
      this.$router.goBack();
    },

    /**
     * 发送信息
     * @param {Null}
     * @return {Null}
     */
    async sendMessage() {
      this.willChat = TRIM(this.willChat);
      if (this.willChat == "") {
        this.$toast.message("不能输入空白内容");
        this.willChat = "";
        return;
      }
      const timeStamp = Number(new Date());
      const { data } = await _http.sendPublicChat({
        chatMessage: this.willChat
      });
      const { code, msg } = data;
      if (code !== 1) {
        this.$toast.error(msg);
        return;
      }
      this.willChat = "";
      SOCKET.emit("chatUpdate", msg);
    },

    /**
     * 下拉加载
     * @param {Null}
     * @return {Null}
     */
    loadData() {
      let { msgBox: wrap } = this.$refs;
      const oldScrollHeight = wrap.scrollHeight; //更新数据前容器的高度
      const bottom = oldScrollHeight - wrap.scrollTop - 547; //获取滚动条到底部的距离
      if (wrap.scrollTop < 200) {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(async () => {
          this.page++; //页数+1
          const { data } = await _http.getPublicChat({ page: this.page });
          COMMIT("setChat", data.record);
          this.$nextTick(() => {
            wrap.scrollTop = wrap.scrollHeight - oldScrollHeight;
          });
        }, 100);
      }
    },

    /**
     * 时间转换
     * @param {Date,Boolean}
     * @return {null}
     */
    changeDate(date, bool) {
      return recentDate(date, bool);
    }
  },
  computed: {
    ...mapState(["publicChat", "userInfo"])
  }
};
</script>

<style scoped>
.cl::after {
  content: "";
  height: 0;
  line-height: 0;
  display: block;
  visibility: hidden;
  clear: both;
}
.cl {
  zoom: 1;
}
.dise {
  background: #d6e2ee;
}
.room_bar {
  text-align: center;
}
.enter_box {
  position: fixed;
  bottom: 0;
  width: 100vw;
  border-top: 1px solid #888;
  min-height: 60px;
  background: rgba(236, 233, 234, 0.98);
}
.input_box {
  outline: none;
  width: 68vw;
  border: 1px solid #888;
  border-radius: 5px;
  padding: 5px 10px;
  margin: 9px 0 0 8px;
  min-height: 33px;
  max-height: 300px;
  background: #fff;
  transition: 0.3s;
  overflow-y: auto;
}
.sendBtn {
  position: absolute;
  right: 10px;
  bottom: 12px;
}
.msg_box {
  box-sizing: border-box;
  height: 82vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* 优化IOS滑动卡顿 */
}
.msg_one {
  margin: 15px 0;
}
.self_avatar {
  float: right;
  margin: 3px 10px 0 10px;
}
.other_avatar {
  float: left;
  margin: 3px 10px 0 10px;
}
.self_msg,
.other_msg {
  max-width: 76vw;
  border: 1px solid #b4cbde;
  vertical-align: bottom;
  word-wrap: break-word;
  border-radius: 5px;
  padding: 8px;
  font-size: 14px;
  color: #666;
  text-align: left;
  position: relative;
}
.self_msg {
  float: right;
  background: #fff;
}
.self_msg::after {
  content: "";
  position: absolute;
  right: -8px;
  top: 12px;
  border: 4px solid transparent;
  border-left-color: #fff;
}
.self_msg::before {
  content: "";
  position: absolute;
  right: -10px;
  top: 12px;
  border: 4px solid transparent;
  border-left-color: #b4cbde;
}
.other_msg {
  float: left;
  background: #e1ffc7;
}
.other_msg::after {
  content: "";
  position: absolute;
  left: -8px;
  top: 12px;
  border: 4px solid transparent;
  border-right-color: #e1ffc7;
}
.other_msg::before {
  content: "";
  position: absolute;
  left: -10px;
  top: 12px;
  border: 4px solid transparent;
  border-right-color: #b4cbde;
}

.self_title,
.other_title {
  width: 83%;
  color: #666;
  font-size: 12px;
}
.self_title {
  float: right;
  text-align: right;
}
.other_title {
  float: left;
  text-align: left;
}
.msg_time {
  font-size: 12px;
  color: #666;
  text-align: center;
  padding-bottom: 15px;
}
.msg_time span {
  background: rgba(236, 233, 234, 0.8);
  padding: 5px 7px;
  border-radius: 5px;
}
.loading {
  width: 100%;
  text-align: center;
  position: absolute;
}
</style>