import { useState } from "react";
import axios from "axios";
import InputBox from "./components/InputBox";
import AgentCard from "./components/AgentCard";
import ConsensusCard from "./components/ConsensusCard";
import Dropdown from "./components/Dropdown";
import ExportButton from "./components/ExportButton";
import DebateCard from "./components/DebateCard";

export default function App() {
  const [initialResponses, setInitialResponses] = useState([]);
  const [critiques, setCritiques]               = useState([]);
  const [agentResults, setAgentResults]         = useState([]);
  const [consensus, setConsensus]               = useState("");
  const [isLoading, setIsLoading]               = useState(false);
  const [error, setError]                       = useState("");
  const [decisionType, setDecisionType]         = useState("startup");
  const [currentDecision, setCurrentDecision]   = useState("");
  const [count, setCount]                       = useState(0);
  const [hasResults, setHasResults]             = useState(false);
  const [activeTab, setActiveTab]               = useState("initial");

  const analyze = async (decision) => {
    setIsLoading(true);
    setError("");
    setInitialResponses([]);
    setCritiques([]);
    setAgentResults([]);
    setConsensus("");
    setHasResults(false);
    setCurrentDecision(decision);
    setActiveTab("initial");

    try {
      const { data } = await axios.post(
        "https://shadow-board-backend.onrender.com/api/analyze",
        { decision, decisionType }
      );
      setInitialResponses(data.initialResponses);
      setCritiques(data.critiques);
      setAgentResults(data.agents);
      setConsensus(data.consensus);
      setCount((prev) => prev + 1);
      setHasResults(true);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setInitialResponses([]);
    setCritiques([]);
    setAgentResults([]);
    setConsensus("");
    setError("");
    setCurrentDecision("");
    setHasResults(false);
  };

  const tabs = [
    { id: "initial",   label: "① Initial Analysis" },
    { id: "debate",    label: "② Debate" },
    { id: "refined",   label: "③ Refined Analysis" },
    { id: "consensus", label: "④ Consensus" },
  ];

  return (
    <>
      <div className="header">
        <div className="header-badge">⚡ Powered by LLaMA 3.3 · Multi-Agent AI</div>
        <h1>🧠 Shadow Board</h1>
        <p>Get instant advice from 4 AI expert personas on any business decision</p>
        {count > 0 && (
          <div className="counter-badge">
            🎯 {count} decision{count > 1 ? "s" : ""} analyzed this session
          </div>
        )}
      </div>

      <div className="container">
        <Dropdown value={decisionType} onChange={setDecisionType} disabled={isLoading} />
        <InputBox onSubmit={analyze} isLoading={isLoading} />

        {error && <div className="error-box">⚠️ {error}</div>}

        {isLoading && (
          <div className="loading-wrapper">
            <div className="loading-spinner" />
            <p>Running 3-step agent debate...</p>
            <span>This may take 30–45 seconds</span>
          </div>
        )}

        {hasResults && (
          <>
            <div className="decision-label">
              <span className="decision-label-tag">Decision Analyzed</span>
              <p className="decision-label-text">"{currentDecision}"</p>
            </div>

            <div className="tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? "tab-active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "initial" && (
              <div className="agents-grid">
                {initialResponses.map((agent, i) => (
                  <AgentCard key={agent.id} agent={agent} index={i} />
                ))}
              </div>
            )}

            {activeTab === "debate" && (
              <div className="agents-grid">
                {critiques.map((critique, i) => (
                  <DebateCard key={critique.id} critique={critique} index={i} />
                ))}
              </div>
            )}

            {activeTab === "refined" && (
              <div className="agents-grid">
                {agentResults.map((agent, i) => (
                  <AgentCard key={agent.id} agent={agent} index={i} />
                ))}
              </div>
            )}

            {activeTab === "consensus" && (
              <>
                <ConsensusCard content={consensus} />
                <ExportButton
                  decision={currentDecision}
                  agentResults={agentResults}
                  consensus={consensus}
                  decisionType={decisionType}
                />
              </>
            )}

            <button className="reset-btn" onClick={reset}>
              🔄 Analyze Another Decision
            </button>
          </>
        )}
      </div>
    </>
  );
}