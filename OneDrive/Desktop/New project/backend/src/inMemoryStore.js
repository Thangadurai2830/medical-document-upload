const store = {
  sequences: {},
  documents: [],
}

async function getNextSequence(name) {
  if (!store.sequences[name]) store.sequences[name] = 0
  store.sequences[name] += 1
  return store.sequences[name]
}

async function findDocuments() {
  // return a shallow copy
  return store.documents.slice()
}

async function createDocument(data) {
  const doc = {
    id: data.id,
    filename: data.filename,
    filepath: data.filepath,
    filesize: data.filesize,
    created_at: data.created_at || new Date(),
  }
  store.documents.push(doc)
  return doc
}

async function findOneDocument(query) {
  if (query && typeof query.id !== 'undefined') {
    return store.documents.find((d) => d.id === query.id) || null
  }
  return null
}

async function deleteOneDocument(query) {
  if (query && typeof query.id !== 'undefined') {
    const idx = store.documents.findIndex((d) => d.id === query.id)
    if (idx >= 0) store.documents.splice(idx, 1)
    return { deletedCount: idx >= 0 ? 1 : 0 }
  }
  return { deletedCount: 0 }
}

module.exports = {
  getNextSequence,
  findDocuments,
  createDocument,
  findOneDocument,
  deleteOneDocument,
}
