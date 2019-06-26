const mysql = require('mysql')
const dbConfig = require('../config').db;
//连接数据库的参数
const pool = mysql.createPool({
  user: dbConfig.user, //数据库用户名
  password: dbConfig.password, //数据库密码
  database: dbConfig.database, //数据库名
  host: dbConfig.host, //端口
})

//连接数据库
let query = function (sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        resolve(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}
module.exports = {
  query
}