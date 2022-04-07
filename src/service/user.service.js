const User = require('../model/user.model')
class UserService {
  async createUser(username, password) {
    // 添加用户入数据库
    const res = await User.create({ username, password })
    return res.dataValues
  }
  async getUserInfo({ id, username, password, is_admin }) {
    const whereOpt = {}
    id && Object.assign(whereOpt, { id })
    username && Object.assign(whereOpt, { username })
    password && Object.assign(whereOpt, { password })
    is_admin && Object.assign(whereOpt, { is_admin })

    // 查询
    const res = await User.findOne({
      attributes: ['id', 'username', 'password', 'is_admin'],
      where: whereOpt
    })
    return res ? res.dataValues : null
  }
  async updateUserInfoById({ id, username, password, is_admin }) {
    const newUser = {}

    username && Object.assign(newUser, { username })
    password && Object.assign(newUser, { password })
    is_admin && Object.assign(newUser, { is_admin })

    const res = await User.update(newUser, {
      where: {
        id
      }
    })
    return res[0] > 0 ? true : false
  }
}

module.exports = new UserService()