import { useEffect, useState } from 'react'
import type { Document } from '../types'
import { listDocuments, deleteDocument, downloadDocument } from '../api/client'
import { formatBytes, formatDate } from '../utils/format'

type Props = {
  refreshKey: number
  onSuccess: (msg: string) => void
  onError: (msg: string) => void
}

export default function DocumentList({ refreshKey, onSuccess, onError }: Props) {
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)

  async function load() {
    try {
      setLoading(true)
      const data = await listDocuments()
      setDocs(data)
    } catch (err: any) {
      onError(err?.message || 'Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey])

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
      onSuccess('Download started')
    } catch (err: any) {
      onError(err?.message || 'Download failed')
    }
  }

  async function onDelete(doc: Document) {
    try {
      await deleteDocument(doc.id)
      setDocs(prev => prev.filter(d => d.id !== doc.id))
      onSuccess('Document deleted')
    } catch (err: any) {
      onError(err?.message || 'Delete failed')
    }
  }

  return (
    <div className="mt-4">
      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : docs.length === 0 ? (
        <div className="text-gray-600">No documents yet</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {docs.map(doc => (
            <li key={doc.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{doc.filename}</div>
                <div className="text-sm text-gray-600">{formatBytes(doc.filesize)} • {formatDate(doc.created_at)}</div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded border border-gray-300" onClick={() => onDownload(doc)}>Download</button>
                <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => onDelete(doc)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
