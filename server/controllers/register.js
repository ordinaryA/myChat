const {
  findDataByName,
  insertData,
} = require('../models/user_info');

const {
  momentTime
} = require('../utils/myFunction')

const md5 = require("md5");
const randomName = require("chinese-random-name");

module.exports = async (ctx, next) => {
  const {
    username,
    password,
  } = ctx.request.body;
  const ra = Math.floor(Math.random() * 20) + 1;
  const findList = await findDataByName(username);
  if (findList.length > 0) {
    ctx.body = {
      code: 1,
      msg: "用户名已存在",
    }
  } else {
    const info = {
      username,
      password: md5(password),
      nickname: randomName.generate(),
      avatar: `ava_${ra}.jpg`,
      registerTime: momentTime(),
    };
    const {
      affectedRows
    } = await insertData(info);
    if (affectedRows && affectedRows > 0) {
      ctx.body = {
        code: 1,
        msg: "注册成功",
      }
    } else {
      ctx.body = {
        code: 0,
        msg: "注册失败",
      }
    }
  }
}