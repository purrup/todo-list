const express = require('express')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true })
const db = mongoose.connection
const app = express()
const methodOverride = require('method-override')

// 引用 express-handlebars
const exphbs = require('express-handlebars')

// 告訴 express 使用 handlebars 當作 template engine 並預設 layout 是 main
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 引用 body-parser
const bodyParser = require('body-parser')

// 設定 bodyParser
app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride('_method'))

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

app.listen(3000, () => {
  console.log('App is running!')
})
