const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const fs = require('fs')
require('dotenv').config()

const { connect } = require('./db')
const documentRoutes = require('./routes/documents')

const PORT = process.env.PORT || 3000
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/patient_portal'

const app = express()

app.use(cors({ origin: FRONTEND_ORIGIN }))
app.use(morgan('dev'))
app.use(express.json())

const uploadsRoot = path.resolve(__dirname, 'uploads')
fs.mkdirSync(uploadsRoot, { recursive: true })

app.use('/documents', documentRoutes)

app.use((err, _req, res, _next) => {
  console.error(err)
  const status = err && err.status && Number(err.status) >= 400 ? Number(err.status) : 500
  res.status(status).send(err.message || 'Request error')
})

connect(MONGO_URI, { retries: 5, retryDelay: 2000 })
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('MongoDB connection failed after retries:', err && err.message ? err.message : err)
    if (process.env.DEV_FALLBACK === 'true') {
      console.warn('DEV_FALLBACK is enabled — starting server with in-memory store')
      app.listen(PORT, () => console.log(`API (dev fallback) on http://localhost:${PORT}`))
    } else {
      console.error('Server will not start without a database connection. Set DEV_FALLBACK=true to start without Mongo for development.')
      process.exit(1)
    }
  })

