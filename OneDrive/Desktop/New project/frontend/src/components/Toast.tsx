type ToastProps = {
  id: number
  type: 'success' | 'error'
  message: string
  onClose: (id: number) => void
}

export default function Toast({ id, type, message, onClose }: ToastProps) {
  const bgColor = type === 'success' ? 'bg-green-500/20 border-green-400' : 'bg-red-500/20 border-red-400'
  return (
    <div className={`text-white ${bgColor} backdrop-blur-md border shadow-lg rounded-lg px-4 py-2 flex items-center gap-3`}>
      <span className="text-sm">{message}</span>
      <button className="text-white/90 text-xs hover:text-white" onClick={() => onClose(id)}>Dismiss</button>
    </div>
  )
}
