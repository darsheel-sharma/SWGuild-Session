import { useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'

const EXAMPLES = [
  'What should I learn to become a backend engineer?',
  'Should I use PostgreSQL or MongoDB for my project?',
  'How should I structure my next SaaS product?',
  'Should I learn DSA before starting competitive programming?',
  'Is microservices architecture right for a startup?',
]

export default function PromptInput({ onSubmit, isLoading }) {
  const [question, setQuestion] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = question.trim()
    if (!trimmed || isLoading) return
    onSubmit(trimmed)
  }

  function handleExample(text) {
    setQuestion(text)
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
          placeholder="Ask the council anything..."
          rows={3}
          maxLength={2000}
          disabled={isLoading}
          className="
            w-full resize-none rounded-xl
            bg-white/[0.05] border border-white/[0.10]
            text-white placeholder-white/25
            text-sm leading-relaxed
            px-4 py-4 pr-14
            focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.07]
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        />
        <button
          type="submit"
          disabled={!question.trim() || isLoading}
          className="
            absolute right-3 bottom-3
            w-9 h-9 rounded-lg
            bg-violet-600 hover:bg-violet-500
            disabled:bg-white/10 disabled:cursor-not-allowed
            flex items-center justify-center
            transition-all duration-200
          "
        >
          <ArrowRight size={16} className="text-white" />
        </button>
      </form>

      <div className="space-y-2">
        <p className="text-xs text-white/30 flex items-center gap-1.5">
          <Sparkles size={11} />
          Try an example
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => handleExample(ex)}
              disabled={isLoading}
              className="
                text-xs px-3 py-1.5 rounded-full
                border border-white/[0.08] bg-white/[0.03]
                text-white/40 hover:text-white/70 hover:border-white/[0.15] hover:bg-white/[0.06]
                transition-all duration-200 text-left
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
