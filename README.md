# mychat

## 技术栈

- 前台: vue-cli 脚手架 muse-ui 组件库
- 后台: node.js koa2 框架 mysql 数据库

## 在线Demo
-Mychat ：[http://www.almx.top/mychat](http://www.almx.top/mychat)

![awesome](https://github.com/ordinaryA/myChat/blob/master/supply/face1.png)
![awesome](https://github.com/ordinaryA/myChat/blob/master/supply/face2.png)
![awesome](https://github.com/ordinaryA/myChat/blob/master/supply/face3.png)
![awesome](https://github.com/ordinaryA/myChat/blob/master/supply/face4.png)
![awesome](https://github.com/ordinaryA/myChat/blob/master/supply/face5.png)


### v1.1.1 2019/4/15

- 新增

1. 未读消息，对方最后一条消息

- 优化

1. socket 链接增加判断 减少服务器压力

---

### v1.1.1 2019/4/15

- 新增

1. 好友之间相互聊天

---

## v1.1.0 2019/4/14 (重构)

1. 前台异步操作优化为 es7 语法糖, 提取公共方法
2. 后台接口重写 koa2 取代 express, mysql 取代 mongo
3. sql 语句查询优化

---

### v1.0.4 2019/4/4

- 修复

1. 聊天列表波纹点击异常
2. 聊天室刷新页面不会回到底部

- 优化

1.  优化封装函数

---

### v1.0.3 2019/3/5

- 修复

1. 添加好友后显示异常 数据分离为好友列表和发出的好友请求(等待对方回应)

- 优化

1. 封装函数 清理无用代码

---

### v1.0.2 2019/3/4

- 修复

1. 查询好友结果会闪烁
2. 时间戳转换 BUG
3. 添加好友后好友列表会显示已发送的请求的好友

- 新增:

1. 查询好友之后可以添加好友，实时显示请求
2. 同意添加好友后，双方会实时显示
3. 通讯录页面显示自己的好友

---

### v1.0.1 2019/3/3

- 修复：

1. 修复看不见其他人昵称

- 新增：

1. 修改用户昵称
2. 查询其他用户信息及其注册时间

---

### v1.0.0 2019/3/2

- 功能：

1. 帐号的登录注册登出
2. 账号头像修改
3. 一个实时更新的聊天群
