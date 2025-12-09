type Props = {
  type: 'success' | 'error'
  message: string
  onClose?: () => void
}

export default function MessageBanner({ type, message, onClose }: Props) {
  const color = type === 'success' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'
  return (
    <div className={`border ${color} rounded px-4 py-2 flex items-center justify-between`}> 
      <span>{message}</span>
      {onClose ? (
        <button className="ml-4 text-sm" onClick={onClose}>✕</button>
      ) : null}
    </div>
  )
}
