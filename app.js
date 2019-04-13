const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
// 載入 todo model
const Todo = require('./models/todo')

// 加上 { useNewUrlParser: true }
mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.get('/', (req, res) => {
  res.send('hello world')
})

app.listen(port, () => {
  console.log(`This app is running on http://localhost:${port}`)
})
