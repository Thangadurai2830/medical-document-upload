import { useState } from 'react'
import { uploadDocument } from '../api/client'
import { IconUpload } from './Icons'

type Props = {
  onUploaded: () => void
  onSuccess: (msg: string) => void
  onError: (msg: string) => void
}

export default function UploadDropzone({ onUploaded, onSuccess, onError }: Props) {
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [fileName, setFileName] = useState('')

  function validate(file: File | null): string | null {
    if (!file) return 'Select a PDF file'
    if (file.type !== 'application/pdf') return 'Only PDF files are allowed'
    if (file.size > 10 * 1024 * 1024) return 'File size must be ≤ 10 MB'
    return null
  }

  async function handleFile(file: File | null) {
    const err = validate(file)
    if (err) {
      onError(err)
      return
    }
    if (!file) return
    try {
      setLoading(true)
      setProgress(20)
      setFileName(file.name)
      await uploadDocument(file)
      setProgress(100)
      onUploaded()
      onSuccess('File uploaded successfully')
    } catch (e: any) {
      onError(e?.message || 'Upload failed')
    } finally {
      setTimeout(() => {
        setLoading(false)
        setProgress(0)
        setFileName('')
      }, 600)
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null
    handleFile(f)
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0] || null
    handleFile(f)
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(true)
  }

  function onDragLeave() {
    setDragOver(false)
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
      <div
        className={`border-2 border-dashed rounded-xl p-10 sm:p-12 flex flex-col items-center justify-center text-center w-full max-w-2xl mx-auto backdrop-blur-sm ${dragOver ? 'border-purple-400 bg-purple-500/20' : 'border-white/30 bg-white/5'}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <IconUpload className="h-10 w-10 text-purple-300" />
        <div className="mt-3 font-medium text-white">Drag and drop your PDF here</div>
        <div className="text-sm text-gray-300">or click to select a file</div>
        <label className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white cursor-pointer shadow-lg hover:shadow-xl transition-shadow">
          <input type="file" accept="application/pdf" className="hidden" onChange={onInputChange} />
          <span>Choose PDF</span>
        </label>
        {loading ? (
          <div className="w-full mt-5">
            <div className="flex items-center justify-between text-sm text-gray-300">
              <span className="truncate max-w-xs text-white">{fileName}</span>
              <span className="text-purple-300">{progress}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded mt-2">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
