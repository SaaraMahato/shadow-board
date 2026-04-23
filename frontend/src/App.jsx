import { useState, useEffect } from "react";
import axios from "axios";
import InputBox from "./components/InputBox";
import AgentCard from "./components/AgentCard";
import ConsensusCard from "./components/ConsensusCard";
import Dropdown from "./components/Dropdown";
import ExportButton from "./components/ExportButton";
import DebateCard from "./components/DebateCard";

export default function App() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showUserSetup, setShowUserSetup] = useState(true);
  const [savedDecisions, setSavedDecisions] = useState([]);
  const [decisionId, setDecisionId] = useState(null);
  
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

  // Initialize user on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUserName = localStorage.getItem("userName");
    const storedUserEmail = localStorage.getItem("userEmail");
    
    if (storedUserId) {
      setUserId(storedUserId);
      setUserName(storedUserName);
      setUserEmail(storedUserEmail);
      setShowUserSetup(false);
      loadUserDecisions(storedUserId);
    }
  }, []);

  const createOrGetUser = async (email, name) => {
    try {
      const { data } = await axios.post("/api/users", { email, name });
      return data;
    } catch (err) {
      console.error("Error creating user:", err);
      return null;
    }
  };

  const loadUserDecisions = async (uId) => {
    try {
      const { data } = await axios.get(`/api/users/${uId}`);
      setSavedDecisions(data.decisions || []);
    } catch (err) {
      console.error("Error loading decisions:", err);
    }
  };

  const handleUserSetup = async (e) => {
    e.preventDefault();
    if (!userEmail.trim()) {
      setError("Email is required");
      return;
    }

    const user = await createOrGetUser(userEmail, userName);
    if (user) {
      setUserId(user._id);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("userName", userName);
      localStorage.setItem("userEmail", userEmail);
      setShowUserSetup(false);
      loadUserDecisions(user._id);
      setError("");
    } else {
      setError("Failed to set up user");
    }
  };

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
      const { data } = await axios.post("/api/analyze", { 
        decision, 
        decisionType,
        userId
      });
      setInitialResponses(data.initialResponses);
      setCritiques(data.critiques);
      setAgentResults(data.agents);
      setConsensus(data.consensus);
      setDecisionId(data._id);
      setCount((prev) => prev + 1);
      setHasResults(true);
      
      // Reload user decisions to reflect the new decision
      if (userId) {
        loadUserDecisions(userId);
      }
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
    setDecisionId(null);
  };

  const logoutUser = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setUserId(null);
    setUserName("");
    setUserEmail("");
    setShowUserSetup(true);
    setSavedDecisions([]);
    reset();
  };

  const tabs = [
    { id: "initial",  label: "① Initial Analysis" },
    { id: "debate",   label: "② Debate" },
    { id: "refined",  label: "③ Refined Analysis" },
    { id: "consensus",label: "④ Consensus" },
  ];

  if (showUserSetup) {
    return (
      <div className="user-setup">
        <div className="user-setup-box">
          <h2>👤 Welcome to Shadow Board</h2>
          <p>Please set up your profile to get started</p>
          <form onSubmit={handleUserSetup}>
            <input
              type="text"
              placeholder="Your Name (optional)"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Your Email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
            {error && <div className="error-box">⚠️ {error}</div>}
            <button type="submit" className="submit-btn">Get Started</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="header">
        <div className="header-badge">⚡ Powered by LLaMA 3.3 · Multi-Agent AI</div>
        <h1>🧠 Shadow Board</h1>
        <p>Get instant advice from 4 AI expert personas on any business decision</p>
        <div className="user-info">
          <span>👤 {userName || userEmail}</span>
          <button onClick={logoutUser} className="logout-btn">Logout</button>
        </div>
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
            {/* Decision Label */}
            <div className="decision-label">
              <span className="decision-label-tag">Decision Analyzed</span>
              <p className="decision-label-text">"{currentDecision}"</p>
            </div>

            {/* Tabs */}
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

            {/* Tab Content */}
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