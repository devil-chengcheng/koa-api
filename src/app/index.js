const path = require('path')

const Koa = require('koa')
const koaBody = require('koa-body')
// 静态资源管理
const KoaStatic = require('koa-static')
// 参数校验
const parameter = require('koa-parameter')
const app = new Koa()

const router = require('../router/index')
const handleError = require('../constant/errorHandler')

// 配置koa-body
app.use(koaBody({
  multipart: true,
  formidable: {
    // 配置选项中不推荐使用相对路径
    uploadDir: path.join(__dirname, '../upload'),
    keepExtensions: true
  },
  // 可解析的请求方式
  parsedMethods: ['POST', 'PUT', 'PATCH', 'DELETE']
}))
app.use(KoaStatic(path.join(__dirname, '../upload')))
app.use(parameter(app))
app.use(router.routes())

// 统一错误处理·
app.on('error', handleError)

module.exports = app
