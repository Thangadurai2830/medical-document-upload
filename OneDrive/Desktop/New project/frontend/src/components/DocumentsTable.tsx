import type { Document } from '../types'
import { formatBytes, formatDate } from '../utils/format'
import { IconDownload, IconTrash } from './Icons'

type Props = {
  documents: Document[]
  loading: boolean
  onDownload: (doc: Document) => void
  onDelete: (doc: Document) => void
}

export default function DocumentsTable({ documents, loading, onDownload, onDelete }: Props) {
  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-4">
        <div className="space-y-3">
          <div className="animate-pulse h-6 bg-white/20 rounded w-40" />
          <div className="animate-pulse h-4 bg-white/20 rounded" />
          <div className="animate-pulse h-4 bg-white/20 rounded w-5/6" />
          <div className="animate-pulse h-4 bg-white/20 rounded w-4/6" />
        </div>
      </div>
    )
  }

  if (!loading && documents.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-8 text-center text-gray-300">
        No documents yet
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden">
      <div className="hidden md:block">
        <table className="w-full">
          <thead className="bg-white/10">
            <tr>
              <th className="text-left text-sm font-semibold text-white px-4 py-3">Name</th>
              <th className="text-left text-sm font-semibold text-white px-4 py-3">Size</th>
              <th className="text-left text-sm font-semibold text-white px-4 py-3">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-white/5">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{doc.filename}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{formatBytes(doc.filesize)}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{formatDate(doc.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button className="px-3 py-1.5 rounded border border-purple-400 text-purple-300 hover:bg-purple-500/20" onClick={() => onDownload(doc)}>
                      <span className="inline-flex items-center gap-1"><IconDownload /> Download</span>
                    </button>
                    <button className="px-3 py-1.5 rounded bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg" onClick={() => onDelete(doc)}>
                      <span className="inline-flex items-center gap-1"><IconTrash /> Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden divide-y divide-white/10">
        {documents.map((doc) => (
          <div key={doc.id} className="p-4">
            <div className="font-medium text-white">{doc.filename}</div>
            <div className="text-sm text-gray-300">{formatBytes(doc.filesize)} • {formatDate(doc.created_at)}</div>
            <div className="flex gap-2 mt-3">
              <button className="px-3 py-1.5 rounded border border-purple-400 text-purple-300 hover:bg-purple-500/20 flex items-center gap-1" onClick={() => onDownload(doc)}>
                <IconDownload /> Download
              </button>
              <button className="px-3 py-1.5 rounded bg-gradient-to-r from-red-500 to-pink-500 text-white flex items-center gap-1 hover:shadow-lg" onClick={() => onDelete(doc)}>
                <IconTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
