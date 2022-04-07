const jwt = require('jsonwebtoken')

const { JWT_SECRET } = require('../config/config.default')
const { createUser, getUserInfo, updateUserInfoById } = require('../service/user.service')
const { registerError, updatePasswordError } = require('../constant/error.type')

class UserController {
  async register(ctx, next) {
    // 获取请求数据
    const { username, password } = ctx.request.body

    try {
      // 操作数据库
      const res = await createUser(username, password)

      // 返回结果
      // ctx.body = `注册成功，用户名${username}， 密码${password}`
      ctx.body = {
        code: 0,
        message: '用户注册成功',
        result: {
          id: res.id,
          username: res.username
        }
      }
    } catch (error) {
      return ctx.app.emit('error', registerError, ctx)
    }
  }
  async login(ctx, next) {
    const { username } = ctx.request.body
    try {
      const { password, ...res } = await getUserInfo({ username })
      console.log(res, 'res')
      ctx.body = {
        code: 0,
        message: '用户登录成功',
        result: {
          token: jwt.sign(res, JWT_SECRET, { expiresIn: '1d' })
        }
      }
    } catch (error) {
      return console.error('用户登录失败', error)
    }
  }
  async update(ctx) {
    const { password } = ctx.request.body
    const { id } = ctx.state.user
    const res = await updateUserInfoById({ id, password })
    if (res) {
      ctx.body = {
        code: 0,
        message: '修改密码成功',
        result: ''
      }
    } else {
      return ctx.app.emit('error', updatePasswordError, ctx)
    }
  }
}

module.exports = new UserController()