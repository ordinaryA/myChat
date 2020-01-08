<template>
  <div class="layout">
    <div class="register">
      <mu-form ref="form" :model="validateForm" class="com_form">
        <mu-form-item
          label="用户名"
          label-float
          prop="username"
          :rules="usernameRules"
        >
          <mu-text-field
            v-model="validateForm.username"
            prop="username"
            color="#333"
            autocomplete="on"
          ></mu-text-field>
        </mu-form-item>
        <mu-form-item
          class="form_inp"
          label="密码"
          prop="password"
          label-float
          :rules="passwordRules"
        >
          <mu-text-field
            color="#000"
            type="password"
            v-model="validateForm.password"
            prop="password"
            autocomplete="off"
          ></mu-text-field>
        </mu-form-item>
        <mu-form-item>
          <mu-button
            round
            flat
            class="form_button"
            color="transparent"
            textColor="#000"
            @click="loginSubmit"
            >登录</mu-button
          >
        </mu-form-item>
        <mu-form-item>
          <mu-button
            to="/register"
            flat
            color="transparent"
            textColor="#000"
            class="form_sm_button"
            >注册用户</mu-button
          >
          <mu-button
            flat
            color="transparent"
            textColor="#000"
            class="form_sm_button"
            >忘记密码</mu-button
          >
        </mu-form-item>
      </mu-form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import buildLogo from "../../components/logo";
import {
  SET_SESSION,
  GET_SESSION,
  SET_LOGO,
  DEL_LOGO,
  COMMIT,
  PUSH,
  DEL_SESSION,
  DISPATCH
} from "../../utils";
import _http from "../../http";

export default {
  data() {
    return {
      usernameRules: [
        { validate: val => !!val, message: "必须填写用户名" },
        { validate: val => val.length >= 3, message: "用户名长度大于3" }
      ],
      passwordRules: [
        { validate: val => !!val, message: "必须填写密码" },
        {
          validate: val => val.length >= 3 && val.length <= 10,
          message: "密码长度大于3小于10"
        }
      ],
      validateForm: {
        username: "",
        password: ""
      }
    };
  },
  created() {
    this.init();
  },
  computed: {
    ...mapState(["LOGO"])
  },
  methods: {
    /**
     * 初始化页面配置
     * @param {Null}
     * @return {Null}
     */
    init() {
      COMMIT("setBottom", false);
      if (GET_SESSION("TOKEN")) {
        DEL_SESSION("TOKEN");
      }
      if (!this.LOGO) {
        SET_LOGO(this);
      }
    },

    /**
     * 登陆表单提交
     * @param {Null}
     * @return {Null}
     */
    async loginSubmit() {
      const result = await this.$refs.form.validate();
      if (result) {
        const { data } = await _http.login(this.validateForm);
        const { msg, code } = data;
        if (code === 1) {
          this.$toast.success(msg);
          SET_SESSION("ISLOGIN", true);
          SET_SESSION("USERID", data.userId);
          setTimeout(() => {
            DEL_LOGO(this);
            COMMIT("setBottom", true);
            PUSH("/");
          }, 1500);
        } else {
          this.$toast.error(msg);
          this.validateForm.password = "";
        }
      } else {
        this.$toast.error("输入不完整");
      }
    }
  }
};
</script>

<style scoped>
@import url("./index.css");
</style>
