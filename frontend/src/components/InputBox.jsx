import { useState } from "react";

export default function InputBox({ onSubmit, isLoading }) {
  const [value, setValue] = useState("");

  const handle = () => {
    if (!value.trim() || isLoading) return;
    onSubmit(value.trim());
  };

  return (
    <div className="input-wrapper">
     <textarea
  style={{ 
    textAlign: "left", 
    direction: "ltr",
    width: "100%",        
    display: "block"      
  }}
  placeholder="Describe your decision... e.g. 'Should I quit my job and launch a SaaS targeting HR teams?'"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handle();
    }
  }}
  disabled={isLoading}
/>
      <button className="analyze-btn" onClick={handle} disabled={isLoading || !value.trim()}>
        {isLoading ? "Running..." : "Analyze →"}
      </button>
    </div>
  );
}