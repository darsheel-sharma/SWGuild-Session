import { Brain, Search, AlertTriangle, Shuffle, Gavel, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react'

const AGENT_ICONS = {
  Analyst: Brain,
  Researcher: Search,
  Critic: AlertTriangle,
  Alternative: Shuffle,
  Judge: Gavel,
}

const AGENT_COLORS = {
  Analyst: { ring: 'border-blue-500/30', badge: 'bg-blue-500/10 text-blue-300', icon: 'text-blue-400' },
  Researcher: { ring: 'border-emerald-500/30', badge: 'bg-emerald-500/10 text-emerald-300', icon: 'text-emerald-400' },
  Critic: { ring: 'border-red-500/30', badge: 'bg-red-500/10 text-red-300', icon: 'text-red-400' },
  Alternative: { ring: 'border-amber-500/30', badge: 'bg-amber-500/10 text-amber-300', icon: 'text-amber-400' },
  Judge: { ring: 'border-violet-500/40', badge: 'bg-violet-500/10 text-violet-300', icon: 'text-violet-400' },
}

function StatusBadge({ status }) {
  if (status === 'completed') {
    return (
      <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-medium">
        <CheckCircle size={10} />
        DONE
      </span>
    )
  }
  if (status === 'error') {
    return (
      <span className="flex items-center gap-1 text-red-400 text-[10px] font-medium">
        <XCircle size={10} />
        ERROR
      </span>
    )
  }
  if (status === 'thinking') {
    return (
      <span className="flex items-center gap-1 text-violet-400 text-[10px] font-medium">
        <Loader2 size={10} className="animate-spin" />
        THINKING
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1 text-white/30 text-[10px] font-medium">
      <Clock size={10} />
      WAITING
    </span>
  )
}

export default function AgentCard({ agent, isLoading = false }) {
  const Icon = AGENT_ICONS[agent.name] || Brain
  const colors = AGENT_COLORS[agent.name] || AGENT_COLORS.Analyst
  const status = isLoading ? 'thinking' : (agent.status || 'waiting')

  return (
    <div
      className={`
        rounded-xl border p-4 glass animate-fade-in
        ${colors.ring}
        transition-all duration-300
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center`}>
            <Icon size={15} className={colors.icon} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white/90 leading-none">{agent.name}</p>
            <p className="text-[10px] text-white/35 mt-0.5">{agent.role}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {isLoading ? (
        <div className="space-y-2 mt-4">
          <div className="h-2 bg-white/[0.06] rounded animate-pulse w-full" />
          <div className="h-2 bg-white/[0.06] rounded animate-pulse w-4/5" />
          <div className="h-2 bg-white/[0.06] rounded animate-pulse w-3/5" />
        </div>
      ) : agent.response ? (
        <div className="max-h-56 overflow-y-auto pr-1 text-xs text-white/70 leading-relaxed mt-2 whitespace-pre-wrap">
          {agent.response.replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/<\/?think>/gi, '').trim()}
        </div>
      ) : null}
    </div>
  )
}
