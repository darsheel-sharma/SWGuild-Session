import { MessageSquare } from 'lucide-react'

export default function DebatePanel({ messages }) {
  if (!messages || messages.length === 0) return null

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={14} className="text-violet-400" />
        <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest">
          Debate Round
        </h3>
      </div>

      <div className="space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                <span className="text-[9px] font-bold text-violet-400">{msg.round}</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">
                {msg.agent}
              </span>
              <p className="text-xs text-white/55 leading-relaxed mt-0.5 whitespace-pre-wrap">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
