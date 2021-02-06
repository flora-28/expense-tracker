const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const Record = require('./models/record')
const categoryList = require('./models/seeds/categories.json').results
const { create } = require('./models/record')

const app = express()
const port = 3000

mongoose.connect('mongodb://localhost/record', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs', helpers: { eq: (x, y) => x === y } }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  Record.find()
    .lean()
    .then(records => {
      let totalAmount = 0
      records.forEach(record => {
        totalAmount += record.amount
      })
      res.render('index', { records, totalAmount, categoryList })
    })
    .catch(error => console.log(error))
})

app.get('/records/new', (req, res) => {
  return res.render('new', { categoryList })
})

app.post('/records', (req, res) => {
  const recordItem = req.body
  const icon = categoryList.find(category => category.name === recordItem.category)
    .icon
  recordItem.categoryIcon = icon

  Record.create(recordItem)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/records/:id/edit', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then((record) => res.render('edit', { record, categoryList }))
    .catch(error => console.log(error))
})

app.post('/records/:id/edit', (req, res) => {
  const id = req.params.id
  const { name, Category, date, amount } = req.body
  let [category, categoryIcon] = Category.split('/')
  const newCategory = { category, categoryIcon }
  const newReqBody = Object.assign(req.body, newCategory)
  Record.findById(id)
    .then(record => {
      record = Object.assign(record, newReqBody)
      return record.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.post('/records/:id/delete', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/records/filter', (req, res) => {
  const filter = req.query.filter
  if (filter === 'all') res.redirect('/')
  Record.find({ category: filter })
    .lean()
    .then(records => {
      let totalAmount = 0
      records.forEach(record => {
        totalAmount += record.amount
      })
      res.render('index', { records, totalAmount, filter })
    })
    .catch(error => console.log(error))
})



app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})