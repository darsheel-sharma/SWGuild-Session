import AgentCard from './AgentCard.jsx'

const AGENT_PLACEHOLDERS = [
  { name: 'Analyst', role: 'Structured Analysis' },
  { name: 'Researcher', role: 'Context & Evidence' },
  { name: 'Critic', role: "Devil's Advocate" },
  { name: 'Alternative', role: 'Alternative Perspectives' },
]

export default function CouncilCard({ agents, isLoading }) {
  // When loading, show placeholder cards; when done, show real agents
  const displayAgents = agents && agents.length > 0 ? agents : AGENT_PLACEHOLDERS

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {displayAgents.map((agent) => (
        <AgentCard
          key={agent.name}
          agent={agent}
          isLoading={isLoading}
        />
      ))}
    </div>
  )
}
