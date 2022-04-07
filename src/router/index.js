const fs = require('fs')
const Router = require('koa-router')
const router = new Router()

fs.readFileSync(__dirname).forEach(file => {
  if (file !== 'index.js') {
    let r = require('./' + file)
    router.use(r.routes())
  }
})

module.exports = router