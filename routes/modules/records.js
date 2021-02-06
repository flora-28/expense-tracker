const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const categoryList = require('../../models/seeds/categories.json').results

router.get('/new', (req, res) => {
  return res.render('new', { categoryList })
})

router.post('/', (req, res) => {
  const recordItem = req.body
  const icon = categoryList.find(category => category.name === recordItem.category)
    .icon
  recordItem.categoryIcon = icon

  Record.create(recordItem)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then((record) => res.render('edit', { record, categoryList }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.get('/filter', (req, res) => {
  const filter = req.query.filter
  if (filter === 'all')
    return res.redirect('/')
  return Record.find({ category: filter })
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

module.exports = router