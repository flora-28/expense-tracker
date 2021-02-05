const mongoose = require('mongoose')
const Category = require('../category')
const categoryList = require('./categories.json').results

mongoose.connect('mongodb://localhost/record', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  const categories = []
  categoryList.forEach(category => {
    categories.push(category)
  })
  Category.create(categories)
    .then(() => {
      console.log('done')
    })
})