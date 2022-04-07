const bcrypt = require('bcryptjs')

const { getUserInfo } = require('../service/user.service')
const { userFormatError,
  userAlreadyExisted,
  registerError,
  userUnRegisterError,
  userLoginError,
  userPasswordError } = require('../constant/error.type')

const userValidator = async (ctx, next) => {
  const { username, password } = ctx.request.body

  // 合理性，判断username、password是否为空
  if (!username || !password) {
    return ctx.app.emit('error', userFormatError, ctx)
  }
  await next()
}

const verifyUser = async (ctx, next) => {
  const { username } = ctx.request.body

  // 合法性, 判断数据库中是否已有用户存在
  // 对数据库进行查找
  try {
    if (await getUserInfo({ username })) {
      return ctx.app.emit('error', userAlreadyExisted, ctx)
    }
  } catch (error) {
    return ctx.app.emit('error', registerError, ctx)
  }
  await next()
}

const cryptPassword = async (ctx, next) => {
  const { password } = ctx.request.body
  const salt = bcrypt.genSaltSync(10)
  // hash保存的是密文
  const hash = bcrypt.hashSync(password, salt)

  ctx.request.body.password = hash
  await next()
}

const verifyLogin = async (ctx, next) => {
  const { username, password } = ctx.request.body

  try {
    // 1. 判断用户是否已经存在
    const res = await getUserInfo({ username })
    if (!res) {
      return ctx.app.emit('error', userUnRegisterError, ctx)
    }

    // 2. 密码是否匹配
    if (!bcrypt.compareSync(password, res.password)) {
      return ctx.app.emit('error', userPasswordError, ctx)
    }
  } catch (error) {
    ctx.app.emit('error', userLoginError, ctx)
  }
  await next()
}

module.exports = {
  userValidator,
  verifyUser,
  cryptPassword,
  verifyLogin
}