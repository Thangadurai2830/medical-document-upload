import { useEffect, useMemo, useState } from 'react'
import { listDocuments, deleteDocument, downloadDocument } from '../api/client'
import type { Document } from '../types'
import UploadDropzone from '../components/UploadDropzone'
import FilterBar from '../components/FilterBar'
import DocumentsTable from '../components/DocumentsTable'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast from '../components/Toast'

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<'date' | 'name' | 'size'>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [toasts, setToasts] = useState<Array<{ id: number; type: 'success' | 'error'; message: string }>>([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selected, setSelected] = useState<Document | null>(null)

  async function load() {
    try {
      setLoading(true)
      const data = await listDocuments()
      setDocs(data)
    } catch (e: any) {
      pushToast('error', e?.message || 'Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function pushToast(type: 'success' | 'error', message: string) {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  async function onUploaded() {
    await load()
  }

  async function onDownload(doc: Document) {
    try {
      const blob = await downloadDocument(doc.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = doc.filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      pushToast('success', 'Download started')
    } catch (e: any) {
      pushToast('error', e?.message || 'Download failed')
    }
  }

  function requestDelete(doc: Document) {
    setSelected(doc)
    setConfirmOpen(true)
  }

  async function confirmDelete() {
    if (!selected) return
    try {
      await deleteDocument(selected.id)
      setDocs(prev => prev.filter(d => d.id !== selected.id))
      pushToast('success', 'Document deleted')
    } catch (e: any) {
      pushToast('error', e?.message || 'Delete failed')
    } finally {
      setConfirmOpen(false)
      setSelected(null)
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let arr = q ? docs.filter(d => d.filename.toLowerCase().includes(q)) : docs.slice()
    arr.sort((a, b) => {
      let va = 0
      let vb = 0
      if (sortKey === 'name') {
        va = a.filename.localeCompare(b.filename)
        vb = 0
      } else if (sortKey === 'size') {
        va = a.filesize
        vb = b.filesize
      } else {
        va = new Date(a.created_at).getTime()
        vb = new Date(b.created_at).getTime()
      }
      const diff = sortKey === 'name' ? va : va - vb
      return sortDir === 'asc' ? diff : -diff
    })
    return arr
  }, [docs, search, sortKey, sortDir])

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4 text-white">Patient Documents</h1>
      <UploadDropzone onUploaded={onUploaded} onSuccess={(m) => pushToast('success', m)} onError={(m) => pushToast('error', m)} />
      <div className="mt-6">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          sortKey={sortKey}
          sortDir={sortDir}
          onSortChange={(k, d) => {
            setSortKey(k)
            setSortDir(d)
          }}
        />
      </div>
      <div className="mt-4">
        <DocumentsTable documents={filtered} loading={loading} onDownload={onDownload} onDelete={requestDelete} />
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete document"
        description={selected ? `Are you sure you want to delete \"${selected.filename}\"?` : ''}
        onCancel={() => {
          setConfirmOpen(false)
          setSelected(null)
        }}
        onConfirm={confirmDelete}
      />
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(t => (
          <Toast key={t.id} id={t.id} type={t.type} message={t.message} onClose={(id) => setToasts(prev => prev.filter(x => x.id !== id))} />
        ))}
      </div>
    </div>
  )
}
