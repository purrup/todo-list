const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
// 載入 todo model
const Todo = require('./models/todo')

// 引用 body-parser
const bodyParser = require('body-parser')

// 設定 bodyParser
app.use(bodyParser.urlencoded({ extended: true }))

const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 加上 { useNewUrlParser: true }
mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

// 設定路由
// Todo 首頁
app.get('/', (req, res) => {
  Todo.find((err, todos) => {
    if (err) return console.error(err)
    return res.render('index', { todos: todos })
  })
})

// 列出全部 Todo
app.get('/todos', (req, res) => {
  res.send('列出所有 Todo')
})

// 新增一筆 Todo 頁面
app.get('/todos/new', (req, res) => {
  return res.render('new')
})

// 顯示一筆 Todo 的詳細內容
app.get('/todos/:id', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    res.render('detail', { todo: todo })
  })
})

// 新增一筆  Todo
app.post('/todos', (req, res) => {
  const todo = Todo({
    name: req.body.name,
  })
  todo.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
})

// 修改 Todo 頁面
app.get('/todos/:id/edit', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    res.render('edit', { todo: todo })
  })
})

// 修改 Todo
app.post('/todos/:id', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    todo.name = req.body.name
    todo.save(err => {
      if (err) return console.error(err)
      return res.redirect(`/todos/${req.params.id}`)
    })
  })
})

// 刪除 Todo
app.post('/todos/:id/delete', (req, res) => {
  res.send('刪除 Todo')
})

app.listen(port, () => {
  console.log(`This app is running on http://localhost:${port}`)
})
