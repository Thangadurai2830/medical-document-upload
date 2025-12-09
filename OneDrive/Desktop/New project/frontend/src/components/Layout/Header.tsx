export default function Header() {
  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block h-6 w-6 rounded bg-gradient-to-r from-purple-500 to-pink-500" />
          <span className="text-sm sm:text-base font-semibold text-white">Patient Portal</span>
        </div>
      </div>
    </header>
  )
}
