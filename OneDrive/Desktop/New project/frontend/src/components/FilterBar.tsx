import { IconSearch, IconSort } from './Icons'

type Props = {
  search: string
  onSearchChange: (v: string) => void
  sortKey: 'date' | 'name' | 'size'
  sortDir: 'asc' | 'desc'
  onSortChange: (k: 'date' | 'name' | 'size', d: 'asc' | 'desc') => void
}

export default function FilterBar({ search, onSearchChange, sortKey, sortDir, onSortChange }: Props) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 flex-1">
        <div className="relative w-full max-w-md">
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search documents"
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          />
          <div className="absolute left-2 top-2.5 text-gray-300">
            <IconSearch />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-300">Sort</span>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={sortKey}
              onChange={(e) => onSortChange(e.target.value as any, sortDir)}
              className="appearance-none bg-white/10 border border-white/20 rounded-lg py-2 pl-8 pr-6 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="size">Size</option>
            </select>
            <div className="absolute left-2 top-2.5 text-gray-300">
              <IconSort />
            </div>
          </div>
          <select
            value={sortDir}
            onChange={(e) => onSortChange(sortKey, e.target.value as any)}
            className="bg-white/10 border border-white/20 rounded-lg py-2 px-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </div>
    </div>
  )
}
