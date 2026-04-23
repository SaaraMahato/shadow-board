export default function ConsensusCard({ content }) {
  const sections = parseConsensus(content);

  return (
    <div className="consensus-card">
      <div className="consensus-header">
        <span style={{ fontSize: "1.5rem" }}>⚪</span>
        <span className="consensus-title">Scored Consensus</span>
        <span className="consensus-badge">✓ complete</span>
      </div>

      {sections.majority.length > 0 && (
        <div className="consensus-section">
          <h3 className="consensus-section-title" style={{ color: "#22c55e" }}>
            🟢 Majority Insights
          </h3>
          {sections.majority.map((point, i) => (
            <div key={i} className="consensus-point majority">
              <span className="point-dot" style={{ background: "#22c55e" }} />
              <span>{point}</span>
            </div>
          ))}
        </div>
      )}

      {sections.conflicts.length > 0 && (
        <div className="consensus-section">
          <h3 className="consensus-section-title" style={{ color: "#ef4444" }}>
            🔴 Conflicting Points
          </h3>
          {sections.conflicts.map((point, i) => (
            <div key={i} className="consensus-point conflict">
              <span className="point-dot" style={{ background: "#ef4444" }} />
              <span>{point}</span>
            </div>
          ))}
        </div>
      )}

      {sections.scores.length > 0 && (
        <div className="consensus-section">
          <h3 className="consensus-section-title" style={{ color: "#3b82f6" }}>
            📊 Confidence Scores
          </h3>
          {sections.scores.map((score, i) => (
            <ScoreBar key={i} score={score} />
          ))}
        </div>
      )}

      {sections.recommendation && (
        <div className="consensus-section">
          <h3 className="consensus-section-title" style={{ color: "#a855f7" }}>
            🎯 Final Recommendation
          </h3>
          <p className="consensus-recommendation">{sections.recommendation}</p>
        </div>
      )}

      {sections.verdict && (
        <div className={`verdict-badge verdict-${sections.verdict.toLowerCase()}`}>
          Final Verdict: {sections.verdict}
        </div>
      )}
    </div>
  );
}

// Score Bar Component
function ScoreBar({ score }) {
  const agentColors = {
    "Risk Analyst":     "#ef4444",
    "Growth Hacker":    "#22c55e",
    "Financial Hawk":   "#3b82f6",
    "Devil's Advocate": "#f59e0b",
  };

  const color = agentColors[score.name] || "#6366f1";
  const pct   = (score.value / 10) * 100;

  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
        <span style={{ color: "#94a3b8", fontSize: "0.8rem", fontWeight: "600" }}>
          {score.name}
        </span>
        <span style={{ color, fontSize: "0.8rem", fontWeight: "700" }}>
          {score.value}/10
        </span>
      </div>
      <div style={{
        height: "6px", background: "#1e293b",
        borderRadius: "999px", overflow: "hidden"
      }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}, ${color}99)`,
          borderRadius: "999px",
          transition: "width 1s ease",
        }} />
      </div>
    </div>
  );
}

// Parse the consensus text into structured sections
function parseConsensus(content) {
  const result = {
    majority: [],
    conflicts: [],
    scores: [],
    recommendation: "",
    verdict: "",
  };

  if (!content) return result;

  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
  let currentSection = "";

  const agentNames = ["Risk Analyst", "Growth Hacker", "Financial Hawk", "Devil's Advocate"];

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (lower.includes("majority insight"))   { currentSection = "majority";  continue; }
    if (lower.includes("conflicting point"))  { currentSection = "conflicts"; continue; }
    if (lower.includes("confidence score"))   { currentSection = "scores";    continue; }
    if (lower.includes("final recommendation")){ currentSection = "recommendation"; continue; }
    if (lower.includes("verdict"))            { currentSection = "verdict";   continue; }

    const cleanLine = line.replace(/^[•\-*]\s*/, "").trim();
    if (!cleanLine) continue;

    if (currentSection === "majority" && cleanLine.length > 5) {
      result.majority.push(cleanLine);
    }

    if (currentSection === "conflicts" && cleanLine.length > 5) {
      result.conflicts.push(cleanLine);
    }

    if (currentSection === "scores") {
      for (const name of agentNames) {
        if (cleanLine.includes(name)) {
          const match = cleanLine.match(/(\d+(\.\d+)?)\s*\/\s*10/);
          if (match) {
            result.scores.push({ name, value: parseFloat(match[1]) });
          }
        }
      }
    }

    if (currentSection === "recommendation" && cleanLine.length > 5) {
      result.recommendation += cleanLine + " ";
    }

    if (currentSection === "verdict") {
      if (cleanLine.toUpperCase().includes("GO"))     result.verdict = "GO";
      if (cleanLine.toUpperCase().includes("NO-GO"))  result.verdict = "NO-GO";
      if (cleanLine.toUpperCase().includes("MODIFY")) result.verdict = "MODIFY";
      if (line.toUpperCase().includes("VERDICT:")) {
        if (line.toUpperCase().includes("NO-GO"))     result.verdict = "NO-GO";
        else if (line.toUpperCase().includes("MODIFY")) result.verdict = "MODIFY";
        else if (line.toUpperCase().includes("GO"))   result.verdict = "GO";
      }
    }
  }

  result.recommendation = result.recommendation.trim();
  return result;
}