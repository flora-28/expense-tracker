const mongoose = require('mongoose')
const Record = require('../record')
const recordList = require('./record.json')
const categoryList = require('./category.json')

mongoose.connect('mongodb://localhost/record', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  const records = []
  recordList.results.forEach(record => {
    const icon = categoryList.results.find(
      category => category.name === record.category
    ).icon
    record.categoryIcon = icon
    records.push(record)
  })
  Record.create(records)
    .then(() => console.log('done'))
})
