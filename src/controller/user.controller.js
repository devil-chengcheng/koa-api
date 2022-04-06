const { createUser } = require('../service/user.service')
const { registerError } = require('../constant/error.type')
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
      ctx.app.emit('error', registerError, ctx)
    }
  }
  async login(ctx, next) {
    ctx.body = 'login接口'
  }
}

module.exports = new UserController()