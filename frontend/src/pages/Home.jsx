import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Header from '../components/Header.jsx'
import PromptInput from '../components/PromptInput.jsx'
import { Users } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()
  const [isLoading] = useState(false)

  function handleSubmit(question) {
    // Pass question via URL state so Council page can pick it up immediately
    navigate('/council', { state: { question } })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-16">
        {/* Badge */}
        <div className="flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.07] px-3.5 py-1.5 mb-8">
          <Users size={12} className="text-violet-400" />
          <span className="text-xs text-violet-300/80 font-medium">Multi-agent AI panel</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl font-bold text-center mb-4 tracking-tight">
          <span className="text-white">Ask the </span>
          <span className="text-gradient">Council.</span>
        </h1>

        <p className="text-base text-white/40 text-center mb-12 max-w-sm leading-relaxed">
          Multiple perspectives. One synthesized answer.
        </p>

        {/* Input */}
        <PromptInput onSubmit={handleSubmit} isLoading={isLoading} />

        {/* How it works */}
        <div className="mt-20 max-w-2xl w-full">
          <p className="text-[10px] text-white/20 uppercase tracking-widest text-center mb-6">
            How it works
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { step: '01', label: 'You ask', desc: 'Any complex question' },
              { step: '02', label: 'Council debates', desc: '4 agents analyze independently' },
              { step: '03', label: 'Critic pushes back', desc: 'Assumptions get challenged' },
              { step: '04', label: 'Judge decides', desc: 'Balanced synthesis produced' },
            ].map(({ step, label, desc }) => (
              <div key={step} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5">
                <p className="text-[10px] font-mono text-violet-400/60 mb-1.5">{step}</p>
                <p className="text-xs font-semibold text-white/70 mb-0.5">{label}</p>
                <p className="text-[10px] text-white/30 leading-tight">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/[0.05] py-4 text-center">
        <p className="text-[10px] text-white/20">AI Council — structured debate, one answer</p>
      </footer>
    </div>
  )
}
