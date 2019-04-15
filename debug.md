# debug

### 1.本地开发运行时浏览器报错 拒绝加载外网字体 但是打包后运行不会报错

---

**Refused to load the font '<URL>' because it violates the following Content Security Policy directive: "default-src 'self'". Note that 'font-src' was not explicitly set, so 'default-src' is used as a fallback.**

---

- 报错原因：
  开发环境下静态资源引用路径出错

- 解决方法：
  修改 config 下 index.js 里开发环境下静态资源引用路径 然后重启项目

