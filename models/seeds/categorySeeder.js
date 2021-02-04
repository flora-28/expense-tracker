const mongoose = require('mongoose')
const Category = require('../category')
const categoryList = require('./category.json')

mongoose.connect('mongodb://localhost/record', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  const categories = []
  categoryList.results.forEach(category => {
    categories.push(category)
  })
  Category.create(categories)
    .then(() => {
      console.log('done')
    })
})