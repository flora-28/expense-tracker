const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Record = require('./models/record')


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

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
  Record.find()
    .lean()
    .then(records => res.render('index', { records }))
    .catch(error => console.log(error))
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})