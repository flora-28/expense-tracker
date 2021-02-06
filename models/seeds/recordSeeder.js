const Record = require('../record')
const recordList = require('./records.json').results
const categoryList = require('./categories.json').results
const db = require('../../config/mongoose')

db.once('open', () => {
  const records = []
  recordList.forEach(record => {
    const icon = categoryList.find(
      category => category.name === record.category
    ).icon
    record.categoryIcon = icon
    records.push(record)
  })
  Record.create(records)
    .then(() => {
      console.log(`insert records done`)
      return db.close()
    })
    .then(() => console.log(`database connection close`))
})
