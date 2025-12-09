export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  const k = 1024
  const sizes = ['KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(n) / Math.log(k))
  const val = n / Math.pow(k, i)
  return `${val.toFixed(2)} ${sizes[i - 1]}`
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString()
}
