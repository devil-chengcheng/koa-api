const jwt = require('jsonwebtoken')

const { tokenExpiredError, invalidToken, PermissionError } = require('../constants/error.type')
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

const hasAdminPermission = async (ctx, next) => {
  const { is_admin } = ctx.state.user
  if (!is_admin) {
    console.error('该用户没有管理员权限')
    return ctx.app.emit('error', PermissionError, ctx)
  }
  await next()
}

module.exports = {
  auth,
  hasAdminPermission
}