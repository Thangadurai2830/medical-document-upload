const mongoose = require('mongoose')

const documentSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  filesize: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Document', documentSchema)
