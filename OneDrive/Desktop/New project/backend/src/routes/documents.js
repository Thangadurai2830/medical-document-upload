const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const mongoose = require('mongoose')
const { getNextSequence } = require('../db')
const Document = require('../models/Document')
const inMemory = require('../inMemoryStore')

const router = express.Router()

const UPLOADS_DIR = path.resolve(__dirname, '..', 'uploads')
fs.mkdirSync(UPLOADS_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const base = path.basename(file.originalname)
    const safe = base.replace(/[^a-zA-Z0-9._-]/g, '_')
    const name = `${Date.now()}-${safe}`.replace(/\s+/g, '_')
    cb(null, name)
  },
})

function pdfOnly(_req, file, cb) {
  if (file.mimetype !== 'application/pdf') return cb(new Error('Only PDF files are allowed'))
  cb(null, true)
}

const upload = multer({ storage, fileFilter: pdfOnly, limits: { fileSize: 10 * 1024 * 1024 } })

router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    const file = req.file
    if (!file) return res.status(400).send('No file uploaded')

    // choose store depending on DB connectivity
    const usingDb = mongoose.connection && mongoose.connection.readyState === 1
    const nextId = usingDb ? await getNextSequence('documents') : await inMemory.getNextSequence('documents')
    const payload = {
      id: nextId,
      filename: file.originalname,
      filepath: `uploads/${path.basename(file.path).replace(/\\/g, '/')}`,
      filesize: file.size,
      created_at: new Date(),
    }

    const doc = usingDb ? await Document.create(payload) : await inMemory.createDocument(payload)

    res.status(201).json({
      id: doc.id,
      filename: doc.filename,
      filepath: doc.filepath,
      filesize: doc.filesize,
      created_at: doc.created_at.toISOString(),
    })
  } catch (err) {
    next(err)
  }
})

router.get('/', async (_req, res, next) => {
  try {
    const usingDb = mongoose.connection && mongoose.connection.readyState === 1
    let docs = []
    if (usingDb) {
      docs = await Document.find().sort({ created_at: -1 }).lean()
      docs = docs.map((d) => ({
        id: d.id,
        filename: d.filename,
        filepath: d.filepath,
        filesize: d.filesize,
        created_at: new Date(d.created_at).toISOString(),
      }))
    } else {
      const arr = await inMemory.findDocuments()
      arr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      docs = arr.map((d) => ({
        id: d.id,
        filename: d.filename,
        filepath: d.filepath,
        filesize: d.filesize,
        created_at: new Date(d.created_at).toISOString(),
      }))
    }
    res.json(docs)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const usingDb = mongoose.connection && mongoose.connection.readyState === 1
    const doc = usingDb ? await Document.findOne({ id }) : await inMemory.findOneDocument({ id })
    if (!doc) return res.status(404).send('Not found')
    const filePath = path.resolve(__dirname, '..', doc.filepath)
    if (!fs.existsSync(filePath)) return res.status(410).send('File missing')
    res.download(filePath, doc.filename)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const usingDb = mongoose.connection && mongoose.connection.readyState === 1
    const doc = usingDb ? await Document.findOne({ id }) : await inMemory.findOneDocument({ id })
    if (!doc) return res.status(404).send('Not found')
    const filePath = path.resolve(__dirname, '..', doc.filepath)
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    } catch (_) {}
    if (usingDb) {
      await Document.deleteOne({ id })
    } else {
      await inMemory.deleteOneDocument({ id })
    }
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

module.exports = router
