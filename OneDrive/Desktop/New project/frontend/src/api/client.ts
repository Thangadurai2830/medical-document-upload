import type { Document } from '../types'

const BASE = import.meta.env.VITE_API_BASE_URL || ''

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const msg = await res.text().catch(() => '')
    throw new Error(msg || `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function listDocuments(): Promise<Document[]> {
  const res = await fetch(`${BASE}/documents`)
  return handle<Document[]>(res)
}

export async function uploadDocument(file: File): Promise<Document> {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch(`${BASE}/documents/upload`, {
    method: 'POST',
    body: fd,
  })
  return handle<Document>(res)
}

export async function downloadDocument(id: number): Promise<Blob> {
  const res = await fetch(`${BASE}/documents/${id}`)
  if (!res.ok) {
    const msg = await res.text().catch(() => '')
    throw new Error(msg || `Request failed: ${res.status}`)
  }
  return res.blob()
}

export async function deleteDocument(id: number): Promise<void> {
  const res = await fetch(`${BASE}/documents/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const msg = await res.text().catch(() => '')
    throw new Error(msg || `Request failed: ${res.status}`)
  }
}
