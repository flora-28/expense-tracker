const mongoose = require('mongoose')
const Record = require('../record')
const recordList = require('./record.json')

mongoose.connect('mongodb://localhost/record', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  for (i = 0; i < recordList.results.length; i++) {
    Record.create(recordList.results[i]);
  }
  console.log('done')
})
