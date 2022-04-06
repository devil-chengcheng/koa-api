const { Sequelize } = require('sequelize')

const { MYSQL_HOST, MYSQL_USER, MYSQL_PSD, MYSQL_DB } = require('../config/config.default')

const sequelize = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PSD, {
  host: MYSQL_HOST,
  dialect: 'mysql'
})

// 测试连接
// sequelize.authenticate().then(res => {
//   console.log('连接数据库成功')
// }).catch(err => {
//   console.log('连接数据库错误', err)
// })

module.exports = sequelize