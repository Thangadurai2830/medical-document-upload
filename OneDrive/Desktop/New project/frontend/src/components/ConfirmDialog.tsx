type Props = {
  open: boolean
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ open, title, description, confirmText = 'Delete', cancelText = 'Cancel', onConfirm, onCancel }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-describedby="confirm-desc">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/20 w-full max-w-sm p-5">
          <h2 className="text-lg font-semibold mb-2 text-white">{title}</h2>
          <p id="confirm-desc" className="text-sm text-gray-300 mb-4">{description}</p>
          <div className="flex justify-end gap-2">
            <button className="px-3 py-1.5 rounded border border-white/30 text-white hover:bg-white/10" onClick={onCancel}>{cancelText}</button>
            <button className="px-3 py-1.5 rounded bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg" onClick={onConfirm}>{confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
