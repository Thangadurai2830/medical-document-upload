export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/20 bg-white/5 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center text-xs text-gray-300">
        © {new Date().getFullYear()} Patient Portal
      </div>
    </footer>
  )
}
