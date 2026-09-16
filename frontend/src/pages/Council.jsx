import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, ChevronDown } from 'lucide-react'

import { useCouncil } from '../hooks/useCouncil.js'
import Header from '../components/Header.jsx'
import CouncilCard from '../components/CouncilCard.jsx'
import DebatePanel from '../components/DebatePanel.jsx'
import FinalVerdict from '../components/FinalVerdict.jsx'
import Message from '../components/Message.jsx'
import PromptInput from '../components/PromptInput.jsx'

export default function Council() {
  const location = useLocation()
  const navigate = useNavigate()
  const { status, result, error, isLoading, isSuccess, convene } = useCouncil()

  const question = location.state?.question

  useEffect(() => {
    if (!question) {
      navigate('/', { replace: true })
      return
    }
    convene(question)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleNewQuestion(q) {
    navigate('/council', { state: { question: q } })
    // Re-run council on same page
    convene(q)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-3xl px-5 pt-24 pb-20">

        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors mb-8 group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        {/* Question display */}
        {question && (
          <div className="mb-8">
            <p className="text-[10px] text-white/25 uppercase tracking-widest mb-2">Your question</p>
            <h1 className="text-xl font-semibold text-white/85 leading-snug">{question}</h1>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mb-6">
            <Message type="error" message={error} />
          </div>
        )}

        {/* Loading / Results */}
        {(isLoading || isSuccess) && (
          <div className="space-y-8">
            {/* Section header */}
            <SectionLabel
              label="Council"
              subtitle="Analyzing independently..."
              active={isLoading}
            />

            {/* Agent grid */}
            <CouncilCard
              agents={isSuccess ? result?.agents : []}
              isLoading={isLoading}
            />

            {/* Divider with arrow */}
            {(isLoading || isSuccess) && (
              <div className="flex flex-col items-center gap-1 py-2">
                <ChevronDown size={16} className="text-white/15" />
              </div>
            )}

            {/* Debate round */}
            {isLoading ? (
              <LoadingSection label="Debate Round" />
            ) : (
              result?.debate && result.debate.length > 0 && (
                <>
                  <SectionLabel label="Debate Round" subtitle="Critic reviews all responses" />
                  <DebatePanel messages={result.debate} />
                </>
              )
            )}

            {/* Arrow to judge */}
            {(isLoading || isSuccess) && (
              <div className="flex flex-col items-center gap-1 py-2">
                <ChevronDown size={16} className="text-white/15" />
              </div>
            )}

            {/* Judge / Verdict */}
            {isLoading ? (
              <LoadingSection label="Judge" spinner />
            ) : (
              result?.verdict && (
                <FinalVerdict verdict={result.verdict} />
              )
            )}
          </div>
        )}

        {/* Ask another question */}
        {isSuccess && (
          <div className="mt-14 border-t border-white/[0.06] pt-10">
            <p className="text-xs text-white/30 mb-5 text-center">Ask the council another question</p>
            <PromptInput onSubmit={handleNewQuestion} isLoading={isLoading} />
          </div>
        )}
      </main>
    </div>
  )
}

function SectionLabel({ label, subtitle, active }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[10px] text-white/25 uppercase tracking-widest mb-0.5">{label}</p>
        {subtitle && (
          <p className="text-xs text-white/40">{subtitle}</p>
        )}
      </div>
      {active && <Loader2 size={13} className="text-violet-400 animate-spin" />}
    </div>
  )
}

function LoadingSection({ label, spinner }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        {spinner && <Loader2 size={13} className="text-violet-400 animate-spin" />}
        <p className="text-xs text-white/30">{label} — working...</p>
      </div>
      <div className="space-y-2">
        <div className="h-2 bg-white/[0.05] rounded w-full" />
        <div className="h-2 bg-white/[0.05] rounded w-3/4" />
        <div className="h-2 bg-white/[0.05] rounded w-1/2" />
      </div>
    </div>
  )
}
