const { DataTypes } = require('sequelize')
const sequelize = require('../db/seq')

const User = sequelize.define('node_user', {
  // id会被sequelize自动创建管理
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: '用户名，唯一'
  },
  password: {
    type: DataTypes.CHAR(64),
    allowNull: false,
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0
  }
})

// 强制同步数据库表
// User.sync({ force: true })

module.exports = User