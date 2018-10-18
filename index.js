require('dotenv/config')
const server = require('json-server')

const app = server.create()
const middleware = server.defaults()
const router = server.router('db.json')

app.use(middleware)
app.use(router)
app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT)
})
