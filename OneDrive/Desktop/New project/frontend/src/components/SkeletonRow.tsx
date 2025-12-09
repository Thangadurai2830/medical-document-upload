export default function SkeletonRow() {
  return (
    <div className="animate-pulse flex items-center justify-between py-3">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-48" />
        <div className="h-3 bg-gray-200 rounded w-32 mt-2" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-20 bg-gray-200 rounded" />
        <div className="h-8 w-20 bg-gray-200 rounded" />
      </div>
    </div>
  )
}
