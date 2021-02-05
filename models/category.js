const mongoose = require('mongoose')
const Schema = mongoose.Schema
const categorySchema = new Schema({
  name: String,
  name_en: String,
  icon: String
})

module.exports = mongoose.model('Category', categorySchema)