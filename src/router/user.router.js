const Router = require('koa-router')
const { register, login } = require('../controller/user.controller')
const { userValidator, verifyUser, cryptPassword } = require('../middleware/user.middleware')

const router = new Router({ prefix: '/user' })

// router.get('/', (ctx, next) => {
//   ctx.body = 'user路由'
// })

router.post('/register', userValidator, verifyUser, cryptPassword, register)

router.post('/login', login)

module.exports = router