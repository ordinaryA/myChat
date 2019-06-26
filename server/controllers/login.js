const md5 = require("md5");
const {
	findUsernameAndPassword
} = require('../models/user_info')
const {
	dispose
} = require('../utils/myFunction')

module.exports = async (ctx, next) => {
	const {
		username,
		password,
	} = ctx.request.body;
	const res = await findUsernameAndPassword({
		username,
		password: md5(password)
	});
	const info = dispose(res);
	if (info.length > 0) {
		ctx.body = {
			code: 1,
			msg: '登录成功',
			userId: info[0].userId,
		}
	} else {
		ctx.body = {
			code: 0,
			msg: '用户名密码错误'
		}
	}
};