const mongoose = require('mongoose')

async function connect(uri, options = {}) {
  const { retries = 5, retryDelay = 2000 } = options
  mongoose.set('strictQuery', true)
  mongoose.set('bufferCommands', false)
  mongoose.set('bufferTimeoutMS', 2000)

  let lastErr
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      })
      return
    } catch (err) {
      lastErr = err
      console.error(`MongoDB connect attempt ${attempt} failed:`, err.message || err)
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, retryDelay))
      }
    }
  }

  // All retries exhausted
  throw lastErr
}

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
})

const Counter = mongoose.model('Counter', counterSchema)

async function getNextSequence(name) {
  const ret = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  )
  return ret.seq
}

module.exports = { connect, getNextSequence }
