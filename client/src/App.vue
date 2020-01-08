<template>
  <div id="app">
    <!-- <Loading v-show="loading" /> -->
    <router-view />
    <div class="app-bottom" v-show="isNotBottom">
      <mu-paper class="this_paper" :z-depth="5">
        <mu-bottom-nav :value="navDefult">
          <mu-bottom-nav-item
            v-for="(item,index) in navList"
            :key="index"
            :value="item.value"
            :title="item.title"
            :icon="item.icon"
            :to="item.to"
          />
        </mu-bottom-nav>
      </mu-paper>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Loading from "./components/loading";
export default {
  name: "App",
  data() {
    return {
      navDefult: "chat",
      navList: [
        {
          value: "chat",
          title: "消息",
          icon: ":iconfont icon-message",
          to: { name: "chat" }
        },
        {
          value: "friend",
          title: "通讯录",
          icon: ":iconfont icon-friend",
          to: { name: "friend" }
        },
        {
          value: "find",
          title: "发现",
          icon: ":iconfont icon-likefill",
          to: { name: "find" }
        },
        {
          value: "mine",
          title: "我的",
          icon: ":iconfont icon-peoplefill",
          to: { name: "mine" }
        }
      ]
    };
  },
  computed: {
    ...mapState(["isNotBottom", "loading"])
  },
  methods: {},
  components: {
    Loading
  }
};
</script>

<style scoped>
#app {
  height: 100vh;
  width: 100vw;
  background: #ededed;
}
.app-bottom {
  position: fixed;
  bottom: 0;
  z-index: 102;
  width: 100%;
}
/* test */
</style>
