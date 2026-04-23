export default function DebateCard({ critique }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.6))",
      border: `1px solid ${critique.reviewerColor}30`,
      borderRadius: "16px",
      padding: "1.25rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Top accent */}
      <div style={{
        height: "2px",
        background: `linear-gradient(90deg, ${critique.reviewerColor}, transparent)`,
        borderRadius: "999px",
        marginBottom: "1rem",
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "1.1rem" }}>{critique.reviewerEmoji}</span>
        <span style={{ color: "#fff", fontWeight: "700", fontSize: "0.9rem" }}>
          {critique.reviewerName}
        </span>
        <span style={{ color: "#64748b", fontSize: "0.8rem" }}>critiques</span>
        <span style={{ color: "#94a3b8", fontWeight: "600", fontSize: "0.85rem" }}>
          {critique.targetName}
        </span>
        <span style={{
          marginLeft: "auto", fontSize: "0.65rem", fontWeight: "600",
          color: critique.reviewerColor,
          border: `1px solid ${critique.reviewerColor}50`,
          padding: "2px 8px", borderRadius: "999px"
        }}>
          ⚔️ debate
        </span>
      </div>

      {/* Content */}
      <div style={{
        color: "#94a3b8", fontSize: "0.825rem",
        lineHeight: "1.7", whiteSpace: "pre-wrap"
      }}>
        {critique.content}
      </div>
    </div>
  );
}