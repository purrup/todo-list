const express = require('express')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true })
const db = mongoose.connection
const app = express()
const methodOverride = require('method-override')

// 載入 express-session 與 passport
const session = require('express-session')
const passport = require('passport')

// 引用 express-handlebars
const exphbs = require('express-handlebars')
// 告訴 express 使用 handlebars 當作 template engine 並預設 layout 是 main
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 引用 body-parser
const bodyParser = require('body-parser')
// 設定 bodyParser and methodOverride
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// 使用 express session
app.use(
  session({
    secret: 'your secret key', // secret: 定義一組自己的私鑰（字串, 字串內容可隨意)
  })
)
// 使用 Passport
app.use(passport.initialize())
app.use(passport.session())
// 載入 Passport config
require('./config/passport')(passport)
// 登入後可以取得使用者的資訊方便我們在 view 裡面直接使用
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

const Todo = require('./models/todo')

// 設定路由
// Todo 首頁
app.get('/', (req, res) => {
  Todo.find({})
    .sort({ name: 'asc' })
    .exec((err, todos) => {
      if (err) return console.error(err)
      return res.render('index', { todos: todos })
    })
})

// 載入路由器。當路徑是/todos時，執行後面的callback函數 require('./routes/todo')
app.use('/', require('./routes/home'))
app.use('/todos', require('./routes/todo'))
app.use('/users', require('./routes/user'))

app.listen(3000, () => {
  console.log('App is running!')
})
