import { useState } from 'react'
import { uploadDocument } from '../api/client'

type Props = {
  onUploaded: () => void
  onSuccess: (msg: string) => void
  onError: (msg: string) => void
}

export default function UploadForm({ onUploaded, onSuccess, onError }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null
    setFile(f)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) {
      onError('Select a PDF file')
      return
    }
    if (file.type !== 'application/pdf') {
      onError('Only PDF files are allowed')
      return
    }
    const max = 10 * 1024 * 1024
    if (file.size > max) {
      onError('File size must be ≤ 10 MB')
      return
    }
    try {
      setLoading(true)
      await uploadDocument(file)
      setFile(null)
      onUploaded()
      onSuccess('File uploaded successfully')
    } catch (err: any) {
      onError(err?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-3">
      <input
        type="file"
        accept="application/pdf"
        onChange={onChange}
        className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  )
}
