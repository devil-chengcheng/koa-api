const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/config.default')

const auth = async (ctx, next) => {

  const { authorization } = ctx.request.header
  const token = authorization.replace('Bearer ', '')

  try {
    const userInfo = jwt.verify(token, JWT_SECRET)
    ctx.state.user = userInfo
  } catch (error) {
    console.error('认证失败', error)
    switch (error.name) {
      case 'TokenExpiredError':
        console.log('token已过期', error)
        return ctx.app.emit('error', tokenExpiredError, ctx)
      case 'JsonWebTokenError':
        console.error('无效的token', error)
        return ctx.app.emit('error', invalidToken, ctx)
    }
  }

  await next()
}

module.exports = {
  auth
}