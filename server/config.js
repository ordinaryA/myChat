// const db = require('./const/dev_db') //本地
const db = require('./const/des_db') //线上环境

const baseApi = 'mychat/'

const secret = 'airchat-sec'

module.exports = {
	db,
	baseApi,
	secret,
}