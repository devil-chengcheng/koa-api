const { SERVER_PORT } = require('./config/config.default')

const app = require('./app/index')

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on http://localhost:${SERVER_PORT}`)
})