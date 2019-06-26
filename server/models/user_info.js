const {
	query
} = require('../utils/db');


// 通过用户名查找用户信息 user_info
const findDataByName = name => {
	const _sql = `SELECT * FROM user WHERE username='${name}'`
	return query(_sql, name)
}

// 注册用户
const insertData = req => {
	const {
		username,
		password,
		nickname,
		avatar,
		registerTime
	} = req;
	const _sql = `INSERT INTO user(username,password,nickname,avatar,registerTime) VALUES ('${username}','${password}','${nickname}','${avatar}','${registerTime}')`
	return query(_sql, req)
}

//登录 验证用户名密码
const findUsernameAndPassword = req => {
	const {
		username,
		password
	} = req;
	const _sql = `SELECT * FROM user WHERE username='${username}' AND password='${password}'`
	return query(_sql, req)
}

// 通过id查找用户信息 user 不包括密码
let findInfoById = id => {
	let _sql = `SELECT userId,username,nickname,avatar,registerTime FROM user WHERE userId='${id}'`
	return query(_sql, id)
}

// 修改我的头像
let changeAvatar = req => {
	const {
		avatar,
		id,
	} = req;
	let _sql = `UPDATE user SET avatar='${avatar}' WHERE userId='${id}'`
	return query(_sql, req)
}

// 修改我的昵称
let changeNickname = req => {
	const {
		nickname,
		id,
	} = req;
	let _sql = `UPDATE user SET nickname='${nickname}' WHERE userId='${id}'`
	return query(_sql, req)
}


// .................................


// // 通过用户id查找用户信息 user_info 包括密码
// let findDataByUserid = function (userid) {
// 	let _sql = 'SELECT * FROM user_info WHERE id= ? '
// 	return query(_sql, [userid])
// }

// // 通过用户id查找用户信息 user_info 包括用户名，性别，头像，最后登录时间，状态等，不包括密码
// let getUserInfo = (user_id) => {
// 	const _sql =
// 		'SELECT id AS user_id, username ,sex ,avator,place ,website,github,intro,status FROM user_info   WHERE  user_info.id =? '
// 	return query(_sql, [user_id]);
// }

// // 通过要查看的用户id 查询是否是本机用户的好友  如果是 返回user_id 和 remark 备注
// let isFriend = (user_id, other_user_id) => {
// 	const _sql =
// 		'SELECT  * FROM user_user_relation  AS u WHERE  u.user_id = ? AND u.other_user_id = ? '
// 	return query(_sql, [user_id, other_user_id]);
// }

// // 加为好友 单方面
// let addAsFriend = (user_id, other_user_id, time) => {
// 	const _sql =
// 		'INSERT INTO user_user_relation(user_id,other_user_id,time) VALUES (?,?,?)'
// 	return query(_sql, [user_id, other_user_id, time]);
// }

// //两边都互加为好友
// // let addFriendEachOther = (user_id,other_user_id)=>{
// //     const _sql =
// //   'INSERT INTO user_user_relation(user_id,other_user_id) VALUES (?,?)'
// //     return query(_sql, [user_id,other_user_id]);
// // }

// // 删除好友
// let delFriend = (user_id, other_user_id) => {
// 	const _sql =
// 		'DELETE FROM  user_user_relation WHERE user_id = ? AND other_user_id = ?'
// 	return query(_sql, [user_id, other_user_id]);
// }

// //屏蔽好友
// let shieldFriend = (status, user_id, other_user_id) => {
// 	const _sql =
// 		'UPDATE  user_user_relation  SET shield = ?  WHERE  user_id = ? AND other_user_id = ? '
// 	return query(_sql, [status, user_id, other_user_id]);
// }

// //修改备注
// let editorRemark = (remark, user_id, other_user_id) => {
// 	const _sql =
// 		'UPDATE  user_user_relation  SET remark = ?  WHERE  user_id = ? AND other_user_id = ? '
// 	return query(_sql, [remark, user_id, other_user_id]);
// }


module.exports = {
	insertData,
	findDataByName,
	findUsernameAndPassword,
	findInfoById,
	changeAvatar,
	changeNickname,
}