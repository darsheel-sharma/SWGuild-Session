import { Gavel, CheckCircle2, XCircle, Lightbulb, ArrowRight } from 'lucide-react'

export default function FinalVerdict({ verdict }) {
  if (!verdict) return null

  return (
    <div className="rounded-2xl border border-violet-500/25 bg-violet-500/[0.04] p-6 animate-slide-up glow-accent">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
          <Gavel size={18} className="text-violet-400" />
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-violet-400/70 uppercase">
            Final Verdict
          </p>
          <h2 className="text-base font-semibold text-white/90">Judge's Synthesis</h2>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-5">
        <p className="text-sm text-white/75 leading-relaxed">{verdict.summary}</p>
      </div>

      {/* Reasoning */}
      {verdict.reasoning && (
        <div className="mb-5 border-l-2 border-violet-500/30 pl-4">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">Reasoning</p>
          <p className="text-xs text-white/55 leading-relaxed">{verdict.reasoning}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {/* Key Points */}
        {verdict.key_points?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
              Key Points
            </p>
            <ul className="space-y-1.5">
              {verdict.key_points.map((pt, i) => (
                <li key={i} className="flex gap-2 text-xs text-white/60">
                  <span className="text-violet-400 mt-0.5 flex-shrink-0">•</span>
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Areas of Agreement */}
        {verdict.areas_of_agreement?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-emerald-400/60 uppercase tracking-wider mb-2 flex items-center gap-1">
              <CheckCircle2 size={10} />
              Agreement
            </p>
            <ul className="space-y-1.5">
              {verdict.areas_of_agreement.map((pt, i) => (
                <li key={i} className="flex gap-2 text-xs text-white/60">
                  <span className="text-emerald-400 mt-0.5 flex-shrink-0">+</span>
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Areas of Disagreement */}
        {verdict.areas_of_disagreement?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-red-400/60 uppercase tracking-wider mb-2 flex items-center gap-1">
              <XCircle size={10} />
              Disagreement
            </p>
            <ul className="space-y-1.5">
              {verdict.areas_of_disagreement.map((pt, i) => (
                <li key={i} className="flex gap-2 text-xs text-white/60">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">−</span>
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Steps */}
        {verdict.next_steps?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-amber-400/60 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Lightbulb size={10} />
              Next Steps
            </p>
            <ul className="space-y-1.5">
              {verdict.next_steps.map((step, i) => (
                <li key={i} className="flex gap-2 text-xs text-white/60">
                  <ArrowRight size={10} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
