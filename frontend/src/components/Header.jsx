import { Users } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-violet-600/90 flex items-center justify-center">
            <Users size={14} className="text-white" />
          </div>
          <span className="text-sm font-semibold tracking-wide text-white/90 group-hover:text-white transition-colors">
            AI Council
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/40 hover:text-white/70 transition-colors px-3 py-1.5"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
