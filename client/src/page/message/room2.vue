<template>
  <div class="dise">
    <mu-appbar class="room_bar">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value=":iconfont icon-back" />
      </mu-button>
      <span class="room_name">{{ anotherInfo.nickname }}</span>
      <mu-button icon slot="right">
        <mu-icon value=":iconfont icon-more" />
      </mu-button>
    </mu-appbar>
    <div class="msg_box" ref="msgBox" @scroll.passive="loadData()">
      <div v-if="chat.length == 0" class="first_tip">
        你们成为好友啦，快开始聊天吧
      </div>
      <div v-else>
        <div class="msg_one cl" v-for="(item, i) in addDateOfChat" :key="i">
          <div v-if="item.needTime" class="msg_time">
            <span>{{ changeDate(item.chatTimestamp, true) }}</span>
          </div>
          <mu-avatar :class="item.isSelf ? 'self_avatar' : 'other_avatar'">
            <img :src="`./static/avatar/${item.avatar}`" alt />
          </mu-avatar>
          <div>
            <div :class="item.isSelf ? 'self_title' : 'other_title'">
              {{ item.nickname }}
            </div>
            <div :class="item.isSelf ? 'self_msg' : 'other_msg'">
              {{ item.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="enter_box">
      <input
        class="input_box"
        type="text"
        ref="userMsg"
        v-model="willChat"
        maxlength="85"
      />
      <mu-button class="sendBtn" color="primary" @click="sendMessage">
        发送
        <mu-icon right value="send"></mu-icon>
      </mu-button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { COMMIT, PUSH, GET_SESSION, TRIM } from "../../utils";
import { recentDate } from "../../utils/date.js";
import _http from "../../http";
import SOCKET from "../../utils/socket.js";
export default {
  data() {
    return {
      anotherInfo: null,
      chat: [],
      willChat: "",
      page: 1,
      timer: null
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
      const ANOTHER_USER_INFO = GET_SESSION("ANOTHER_USER_INFO");
      this.anotherInfo = JSON.parse(ANOTHER_USER_INFO);
      _http.userBecomeOnline({ ...this.anotherInfo, type: "online" }); //异步更改用户在线状态
      const { data } = await _http.getPrivateChat({
        ...this.anotherInfo,
        page: this.page
      });
      const { code, chat } = data;
      if (code === 1) {
        this.chat = chat;
        this.$nextTick(() => {
          this.$refs.msgBox.scrollTop = this.$refs.msgBox.scrollHeight;
        });
      } else {
        this.$toast.error("网络错误，请刷新后再试");
      }
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
     * Dom建立后绑定事件和socket
     * @param {Null}
     * @return {Null}
     */
    async initBind() {
      this.$refs.userMsg.onkeydown = event =>
        event.keyCode === 13 ? this.sendMessage() : null;
      SOCKET.on("Update_Private_Chat", async socketInfo => {
        const currentInfo = JSON.parse(GET_SESSION("ANOTHER_USER_INFO"));
        //发送socket请求的会话ID等于当前会话的ID时候才会请求聊天记录
        if (currentInfo.chat_id == socketInfo.chat_id) {
          const { data } = await _http.getPrivateChat({
            ...this.anotherInfo,
            page: this.page
          });
          if (data.code === 1) {
            this.chat = data.chat;
            this.$nextTick(() => {
              if (this.$refs.msgBox) {
                this.$refs.msgBox.scrollTop = this.$refs.msgBox.scrollHeight;
              }
            });
          }
        }
      });
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
      const chatTimestamp = Number(new Date());
      const { another_id, chat_id } = this.anotherInfo;
      const { data } = await _http.sendPrivateChat({
        content: this.willChat,
        another_id,
        chat_id,
        type: "text"
      });
      const { code, msg } = data;
      if (code === 1) {
        this.willChat = "";
        SOCKET.emit("Send_Private_Chat_Success", this.anotherInfo);
        SOCKET.emit("Send_Private_Chat_Get_Message_List", this.anotherInfo);
      } else {
        this.$toast.error(msg);
        return;
      }
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
      if (wrap.scrollTop < 20) {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(async () => {
          this.page++; //页数+1
          const { data } = await _http.getPrivateChat({
            ...this.anotherInfo,
            page: this.page
          });
          this.chat = data.chat;
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
    addDateOfChat() {
      const record = this.chat;
      record[0]["needTime"] = true;
      for (var i = 0; i < record.length; i++) {
        if (i + 1 >= record.length) {
          break;
        }
        record[i + 1]["chatTimestamp"] - record[i]["chatTimestamp"] > 180000
          ? (record[i + 1]["needTime"] = true)
          : (record[i + 1]["needTime"] = false);
      }
      return record;
    }
  },
  async beforeRouteLeave(to, from, next) {
    const { data } = await _http.userBecomeOnline({
      ...this.anotherInfo,
      type: "exit"
    });
    if (data.code === 1) {
      next();
    } else {
      next(false);
    }
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
.first_tip {
  width: 220px;
  text-align: center;
  padding: 3px 0;
  margin: 10px auto 0;
  border-radius: 5px;
  background: rgba(236, 233, 234, 0.8);
}
.room_name {
  font-size: 16px;
  color: #666;
}
</style>
