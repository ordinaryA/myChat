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
            autocomplete="off"
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
        <mu-form-item prop="isAgree" :rules="argeeRules">
          <mu-checkbox
            label="同意用户协议"
            color="#000"
            v-model="validateForm.isAgree"
          ></mu-checkbox>
        </mu-form-item>
        <mu-form-item>
          <mu-button
            round
            flat
            class="form_button"
            color="transparent"
            textColor="#000"
            @click="submit"
            >确定注册</mu-button
          >
        </mu-form-item>
      </mu-form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import buildLogo from "../../components/logo";
import { SET_LOGO, DEL_LOGO, COMMIT, PUSH, DISPATCH } from "../../utils";
import _http from "../../http";

export default {
  data() {
    return {
      usernameRules: [
        { validate: val => !!val, message: "必须填写用户名" },
        {
          validate: val => /^[a-zA-Z0-9]{4,16}$/.test(val),
          message: "请输入4到16位字母或数字"
        }
      ],
      passwordRules: [
        { validate: val => !!val, message: "必须填写密码" },
        {
          validate: val => val.length >= 3 && val.length <= 10,
          message: "密码长度大于3小于10"
        }
      ],
      argeeRules: [{ validate: val => !!val, message: "必须同意用户协议" }],
      validateForm: {
        username: "",
        password: "",
        isAgree: false,
        avatar: "./static/avatar/ava_4.jpg",
        timeStamp: null
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
     * 初始化页面
     * @param {Null}
     * @return {Null}
     */
    init() {
      COMMIT("setBottom", false);
      if (!this.LOGO) {
        SET_LOGO(this);
      }
    },

    /**
     * 提交注册表单
     * @param {Null}
     * @return {Null}
     */
    async submit() {
      const result = await this.$refs.form.validate();
      if (result) {
        this.validateForm.timeStamp = Number(new Date());
        const { data } = await _http.register(this.validateForm);
        const { code, msg } = data;
        if (code === 1) {
          this.$toast.success(msg + "2秒后进入登录页面。");
          setTimeout(() => {
            DEL_LOGO(this);
            PUSH("login");
          }, 1500);
        } else {
          this.$toast.error(msg);
          this.formClear();
        }
      } else {
        this.$toast.error("输入不完整");
      }
    },

    /**
     * 表单重置
     * @param {Null}
     * @return {Null}
     */
    formClear() {
      this.validateForm = {
        username: "",
        password: "",
        isAgree: false
      };
    }
  }
};
</script>

<style scoped>
@import url("./index.css");
</style>
