const bcrypt = require('bcryptjs')

const { getUserInfo } = require('../service/user.service')
const { userFormatError, userAlreadyExisted } = require('../constant/error.type')
const userValidator = async (ctx, next) => {
  const { username, password } = ctx.request.body

  // 合理性，判断username、password是否为空
  if (!username || !password) {
    ctx.app.emit('error', userFormatError, ctx)
    return
  }
  await next()
}

const verifyUser = async (ctx, next) => {
  const { username } = ctx.request.body

  // 合法性, 判断数据库中是否已有用户存在
  // 对数据库进行查找
  if (await getUserInfo({ username })) {
    ctx.app.emit('error', userAlreadyExisted, ctx)
    return
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

module.exports = {
  userValidator,
  verifyUser,
  cryptPassword
}