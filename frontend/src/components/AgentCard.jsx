export default function AgentCard({ agent, index }) {
  return (
    <div
      className="agent-card"
      style={{
        borderColor: `${agent.color}40`,
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* Top accent line */}
      <div style={{
        height: "3px",
        background: `linear-gradient(90deg, ${agent.color}, transparent)`,
        borderRadius: "999px",
        marginBottom: "1.25rem",
      }} />

      {/* Header */}
      <div className="agent-card-header">
        <span className="agent-emoji">{agent.emoji}</span>
        <span className="agent-name">{agent.name}</span>
        <span
          className="agent-badge"
          style={{ color: agent.color, borderColor: `${agent.color}50` }}
        >
          ✓ done
        </span>
      </div>

      {/* Content */}
      <div className="agent-content">{agent.content}</div>
    </div>
  );
}