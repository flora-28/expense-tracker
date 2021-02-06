const Category = require('../category')
const categoryList = require('./categories.json').results
const db = require('../../config/mongoose')

db.once('open', () => {
  const categories = []
  categoryList.forEach(category => {
    categories.push(category)
  })
  Category.create(categories)
    .then(() => {
      console.log(`insert categories done`)
      return db.close()
    })
    .then(() => console.log(`database connection close`))
})