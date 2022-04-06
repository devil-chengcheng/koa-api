const Koa = require('koa')
const koaBody = require('koa-body')
const app = new Koa()

const userRouter = require('../router/user.router')
const handleError = require('../constant/errorHandler')

app.use(koaBody())
app.use(userRouter.routes())

app.on('error', handleError)

module.exports = app
