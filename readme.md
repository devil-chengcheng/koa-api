### 项目的结构

该项目是使用koa框架搭建的后台api，包括用户注册、登录和修改密码，可以基于此添加其它的业务逻辑代码

#### 整体组织结构

- `main.js`项目的入口文件，设置服务器开启端口，引入app业务代码
- app：处理业务相关代码
- router：处理不同路由响应，定义`index.js`加载路由文件夹中所有路由后导出
- middleware：定义中间件函数，比如一些权限、参数检验等
- controller：主要处理响应路由中的控制器函数
- service：进行数据库相关操作
- model：定义数据库模型、实体
- constants：定义常量，包括错误类型，统一错误处理等
- db：连接数据库
- `.env`：定义全局配置变量，通过`dotenv`读取配置文件
- config：读取`.env`中定义的变量并导出



### 项目的架构搭建

以注册接口为例，展示一个接口的完整流程

1. 新建好文件夹后，初始化项目

   ```
   npm init -y
   ```

   生成`package.json`文件，用于记录项目的依赖

2. 有git需求的话，可以初始化，并配置`.gitignore`文件

   ```
   git init
   ```

3. 安装`koa`，创建`src/main.js`入口文件，编写一个简单的实例

   ```
   pip install koa
   ```

   ```js
   const Koa = require('koa')
   
   const app = new Koa()
   
   app.use((ctx, next) => {
     ctx.body = '测试'
   })
   
   app.listen(8089, () => {
     console.log('Server is running on http://localhost:8089')
   })
   ```

4. 通过`nodemon`实现项目的热启动

   ```
   pip install nodemon -D
   ```

   在`package.json`文件中添加配置

   ```js
   "scripts": {
       "dev": "nodemon src/main.js",
       "test": "echo \"Error: no test specified\" && exit 1"
   },
   ```

   此后，可以通过`npm run dev`命令来启动项目

5. 通过`dotenv`来读取配置文件，可以将一些全局的配置变量定义在`.env`中

   ```
   pip install dotenv
   ```

   创建`.env`文件，并添加全局配置变量

   ```
   SERVER_PORT = 8089
   ```

   创建`src/config/config.default.js`，然后读取`.env`中配置并导出

   ```js
   const dotenv = require('dotenv')
   
   dotenv.config()
   
   module.exports = process.env
   ```

6. 添加路由，根据不同的路径进行对应处理

   ```
   pip install koa-router
   ```

   新建router文件夹用于处理不同路由响应

   新建一个`src/router/user.router.js`路由文件

   - 导入包
   - 实例化对象
   - 编写路由
   - 注册中间件

   ```js
   const Router = require('koa-router')
   const router = new Router({ prefix: '/user' })
   
   router.get('/', (ctx, next) => {
     ctx.body = 'user路由'
   })
   
   module.exports = router
   ```

   在`main.js`中引入

   ```js
   ...
   const userRouter = require('./router/user.router')
   ...
   app.use(userRouter.routes())
   ```

7. 将app业务单独抽取出来，新建`src/app/index.js`

   ```js
   const Koa = require('koa')
   const app = new Koa()
   
   const userRouter = require('../router/user.router.js')
   
   app.use(userRouter.routes())
   module.exports = app
   ```

   重新改写`main.js`

   ```js
   const { SERVER_PORT } = require('./config/config.default')
   
   const app = require('./app/index')
   
   app.listen(SERVER_PORT, () => {
     console.log(`Server is running on http://localhost:${SERVER_PORT}`)
   })
   ```

8. 将路由中的处理函数抽取出controller控制器

   新建`src/controller/user.controller.js`文件用于处理user路由中的不同路径对应函数

   比如，现在`src/router/user.router.js`中有用户注册、登录两个接口

   ```js
   ...
   router.post('/register', (ctx, next) => {
     // 处理函数
   })
   
   router.post('/login', (ctx, next) => {
     // 处理函数
   })
   ...
   ```

   可以将注册和登录接口的处理函数抽取出来，放入`src/controller/user.controller.js`中

   ```js
   class UserController {
     async register(ctx, next) {
       ctx.body = 'register接口'
     }
     async login(ctx, next) {
       ctx.body = 'login接口'
     }
   }
   
   module.exports = new UserController()
   ```

   更改`src/router/user.router.js`

   ```js
   ...
   router.post('/register', register)
   
   router.post('/login', login)
   ...
   ```

9. 解析请求body

   安装`koa-body`

   ```
   npm install koa-body
   ```

   在`src/app/index.js`中注册中间件

   ```js
   const koaBody = require('koa-body')
   app.use(koaBody)
   ```

   使用：获取请求中的参数，在`user.controller.js`中的`register`方法中获取

   ```js
   const {username, password} = ctx.request.body
   ```

10. 建立service层，用于操作数据库

    新建`src/service/user.service.js`

    ```js
    class UserService {
      async createUser(username, password) {
        // todo，写入数据库
        return
      }
    }
    
    module.exports = new UserService()
    ```

    然后在`user.controller.js`中进行引入

    ```js
    ...
    const {createUser} = require('../service/user.service.js')
    const res = createUser(username, password)
    ...
    ```

11. 操作数据库，通过`sequelize`连接数据库

    安装`sequelize、mysql2`

    ```
    npm install sequlize mysql2
    ```

    新建`db/seq.js`连接数据库

    ```js
    const { Sequelize } = require('sequelize')
    
    const sequelize = new Sequelize('node', 'root', 'admin', {
      host: 'localhost',
      dialect: 'mysql'
    })
    
    // 测试连接
    sequelize.authenticate().then(res => {
      console.log('连接数据库成功')
    }).catch(err => {
      console.log('连接数据库错误', err)
    })
    ```

    可以将一些mysql数据库参数抽取放入`.env`进行全局配置

    ```
    MYSQL_HOST = localhost
    MYSQL_PORT = 3306
    MYSQL_USER = root
    MYSQL_PSW = admin
    MYSQL_DB = node
    ```

    ```js
    const { Sequelize } = require('sequelize')
    
    const { MYSQL_HOST, MYSQL_USER, MYSQL_PSD, MYSQL_DB } = require('../config/config.default')
    
    const sequelize = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PSD, {
      host: MYSQL_HOST,
      dialect: 'mysql'
    })
    ```

12. 建立Model层，通过Model对应数据库的表

    新建`src/model/user.model.js`

    ```js
    const { DataTypes } = require('sequelize')
    const sequelize = require('../db/seq')
    
    const User = sequelize.define('node_user', {
      // id会被sequelize自动创建管理
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: '用户名，唯一'
      },
      password: {
        type: DataTypes.CHAR(64),
        allowNull: false,
      },
      is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      }
    })
    
    // 强制同步数据库表
    // User.sync({ force: true })
    
    module.exports = User
    ```

13. 注册接口实现添加用户进入数据库

    在`src/service/user.service.js`中编写操作数据库代码

    ```js
    const User = require('../model/user.model')
    class UserService {
      async createUser(username, password) {
        // 添加用户入数据库
        const res = await User.create({ username, password })
        return res.dataValues
      }
    }
    
    module.exports = new UserService()
    ```

    改写`user.controller.js`文件中register函数

    ```js
    async register(ctx, next) {
        // 获取请求数据
        const { username, password } = ctx.request.body
        // 操作数据库
        const res = createUser(username, password)
    
        // 返回结果
        // ctx.body = `注册成功，用户名${username}， 密码${password}`
        ctx.body = {
          code: 0,
          message: '用户注册成功',
          result: {
            id: res.id,
            username: user.username
          }
        }
    }
    ```

14. 错误处理，在控制器中对不同错误进行不同处理，使代码更加健壮

    对注册接口的合理性和合法性进行判断，在`user.controller.js`的register函数中添加

    ```js
    // 合理性，判断username、password是否为空
    if (!username || !password) {
      ctx.status = 400,
      ctx.body = {
        code: '10001',
        message: '用户名或密码为空',
        result: ''
      }
      return
    }
    // 合法性, 判断数据库中是否已有用户存在
    // 对数据库进行查找
    if (getUserInfo({username})) {
      ctx.status = 409, // 冲突
      ctx.body = {
        code: '10002',
        message: '用户已经存在',
        result: ''
      }
      return
    }
    ```

    在`user.service.js`中实现`getUSerInfo`并在`user.controller.js`中导入使用

    ```js
    async getUserInfo({ id, username, password, is_admin }) {
        const whereOpt = {}
        id && Object.assign(whereOpt, { id })
        username && Object.assign(whereOpt, { username })
        password && Object.assign(whereOpt, { password })
        is_admin && Object.assign(whereOpt, { is_admin })
    
        // 查询
        const res = await User.findOne({
          attributes: ['id', 'username', 'password', 'is_admin'],
          where: whereOpt
        })
        return res.dataValues
    }
    ```

15. 拆分中间件，创建middleware中间件层

    为了使代码的逻辑更加清晰，拆分一个中间件层，封装多个中间件函数

    新建`src/middleware/user.middleware.js`文件，将用户注册验证拆分写入该文件中，并导出，在路由模块`user.router.js`中进入控制器controller之前使用

    ```js
    const { getUserInfo } = require('../service/user.service')
    const userValidator = async (ctx, next) => {
      const { username, password } = ctx.request.body
    
      // 合理性，判断username、password是否为空
      if (!username || !password) {
        ctx.status = 400,
          ctx.body = {
            code: '10001',
            message: '用户名或密码为空',
            result: ''
          }
        return
      }
      await next()
    }
    
    const verifyUser = async (ctx, next) => {
      const { username, password } = ctx.request.body
    
      // 合法性, 判断数据库中是否已有用户存在
      // 对数据库进行查找
      if (getUserInfo({ username })) {
        ctx.status = 409, // 冲突
          ctx.body = {
            code: '10002',
            message: '用户已经存在',
            result: ''
          }
        return
      }
    }
    
    module.exports = {
      userValidator,
      verifyUser
    }
    ```

16. 统一的错误处理，将错误类型抽取统一管理，处理不同错误的返回

    新建`src/constant/error.type.js`，用于定义错误类型

    ```js
    module.exports = {
      userFormatError: {
        code: '10001',
        message: '用户名或密码为空',
        result: ''
      },
      userAlreadyExisted: {
        code: '10002',
        message: '用户已存在',
        result: ''
      },
    }
    ```

    然后在错误的地方通过`ctx.app.emit()`提交错误(改写`user.middleware.js`文件)

    ```
    ctx.app.emit('error', userFormatError, ctx)
    ```

    然后在`app/index.js`中通过`app.on`进行监听

    ```js
    app.on('error', (err, ctx) => {
    	// 错误处理函数
    })
    ```

    将错误处理函数抽取，新建`src/constant/errorHandler.js`

    ```js
    module.exports = (err, ctx) => {
      let status = 500
      switch (err.status) {
        case '10001':
          status = 400
          break
        case '10002':
          status = 409
          break
        default:
          status = 500
      }
      ctx.status = status
      ctx.body = err
    }
    ```

17. 添加注册过程出现的其它错误

    改写`user.controller.js`中的register函数

    ```js
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
              username: user.username
            }
          }
        } catch (error) {
          ctx.app.emit('error', registerError, ctx)
        }
      }
    ```

18. 对注册接口的完善，实现对密码加密

    安装`bcryptjs`

    ```
    npm install bcyrptjs
    ```

    添加中间件函数

    ```js
    const cryptPassword = async (ctx, next) => {
      const { password } = ctx.request.body
      const salt = bcrypt.genSaltSync(10)
      // hash保存的是密文
      const hash = bcrypt.hashSync(password, salt)
    
      ctx.request.body.password = hash
      await next()
    }
    ```

    在路由中使用

    ```js
    const { userValidator, verifyUser, cryptPassword } = require('../middleware/user.middleware')
    
    router.post('/register', userValidator, verifyUser, cryptPassword, register)
    ```



**至此，一个简单的koa后台api框架搭建完毕，并以注册接口为例进行了实现。接下来，陆续实现登录、修改密码和一些其它业务相关接口**

