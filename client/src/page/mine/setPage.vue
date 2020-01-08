<template>
  <div class="com_layout setPage">
    <mu-appbar class="com_header">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value=":iconfont icon-back" />
      </mu-button>
      设置
      <mu-list-item-action slot="right"></mu-list-item-action>
    </mu-appbar>
    <mu-list class="avaBox" v-for="(i, idx) in setConfig" :key="idx">
      <mu-list-item
        button
        v-for="(item, n) in i"
        :key="n"
        @click="listFn(item.value)"
      >
        <mu-list-item-content :class="item.center ? 'text_center' : null">{{
          item.tag
        }}</mu-list-item-content>
        <mu-list-item-action v-if="item.icon">
          <mu-icon value=":iconfont icon-right"></mu-icon>
        </mu-list-item-action>
      </mu-list-item>
    </mu-list>
    <mu-bottom-sheet :open.sync="open">
      <mu-list @item-click="closeBottomSheet" class="exit_list">
        <mu-sub-header class="exit_head"
          >退出后不会删除任何历史数据，下次登录依然可以使用本账号。</mu-sub-header
        >
        <mu-list-item
          button
          v-for="(i, idx) in exit"
          :key="idx"
          class="exit_item"
          @click="exitFn(idx)"
        >
          <mu-list-item-title :class="i.className">{{
            i.text
          }}</mu-list-item-title>
        </mu-list-item>
      </mu-list>
    </mu-bottom-sheet>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { DEL_SESSION, PUSH, COMMIT } from "../../utils";
export default {
  data() {
    return {
      setConfig: [
        [
          {
            tag: "关于MyChat",
            value: "about",
            icon: true
          },
          {
            tag: "隐私",
            value: "private",
            icon: true
          }
        ],
        [
          {
            tag: "修改密码",
            value: "revise",
            center: true
          }
        ],
        [
          {
            tag: "退出登录",
            value: "exit",
            center: true
          }
        ]
      ], //个人和设置配置
      open: false,
      exit: [
        {
          text: "退出登录",
          value: "confirm",
          className: "exitBtn"
        },
        {
          text: "取消",
          value: "cancel",
          className: "cancelBtn",
          method: null
        }
      ]
    };
  },
  created() {
    this.init();
  },
  methods: {
    /**
     * 初始化设置
     * @param {Null}
     * @return {Null}
     */
    init() {
      COMMIT("setBottom", false);
    },

    /**
     * 根据字段打开底部栏
     * @param {String}
     * @return {Null}
     */
    listFn(n) {
      switch (n) {
        case "exit":
          this.openBotttomSheet();
          break;
        default:
          console.log("null things");
          break;
      }
    },

    /**
     * 关闭底部栏
     * @param {Null}
     * @return {Null}
     */
    closeBottomSheet() {
      this.open = false;
    },

    /**
     * 打开底部栏
     * @param {Null}
     * @return {Null}
     */
    openBotttomSheet() {
      this.open = true;
    },

    /**
     * 根据索引调用方法
     * @param {Number}
     * @return {Null}
     */
    exitFn(i) {
      if (i === 0) {
        this.exitUser();
      }
    },

    /**
     * 登出用户
     * @param {Null}
     * @return {Null}
     */
    exitUser() {
      DEL_SESSION("ISLOGIN");
      DEL_SESSION("TOKEN");
      PUSH("login");
    },

    /**
     * 返回上一级
     * @param {Null}
     * @return {Null}
     */
    goBack() {
      this.$router.goBack();
    }
  }
};
</script>

<style scoped>
.setPage {
  padding-top: 70px;
}
.avaBox {
  padding: 0;
  background: #fff;
  border-bottom: 1px solid #d5d5d5;
  border-top: 1px solid #d5d5d5;
  margin-bottom: 8px;
}
.text_center {
  text-align: center;
}
.exitBtn,
.cancelBtn {
  text-align: center;
  font-size: 14px;
}
.exitBtn {
  color: #c01111;
}
.cancelBtn {
  color: #333;
}
.exit_head {
  text-align: center;
  font-size: 12px;
}
.exit_list {
  padding-bottom: 0;
}
.exit_item {
  border-bottom: 1px solid #d5d5d5;
}
.exit_item:nth-last-child(1) {
  border-bottom: none;
}
</style>
