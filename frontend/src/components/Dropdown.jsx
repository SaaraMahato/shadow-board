export default function Dropdown({ value, onChange, disabled }) {
  const options = [
    { value: "startup",  label: "🚀 Startup / Business" },
    { value: "career",   label: "💼 Career / Job" },
    { value: "finance",  label: "💰 Finance / Investment" },
    { value: "academic", label: "🎓 Academic / Research" },
  ];

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{
        display: "block", color: "#94a3b8",
        fontSize: "0.8rem", fontWeight: "600",
        textTransform: "uppercase", letterSpacing: "0.08em",
        marginBottom: "0.5rem"
      }}>
        Decision Type
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: "100%", padding: "0.75rem 1rem",
          backgroundColor: "#1e293b", border: "1px solid #334155",
          borderRadius: "12px", color: "#f1f5f9",
          fontSize: "0.9rem", fontFamily: "Inter, sans-serif",
          cursor: "pointer", outline: "none",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 1rem center",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}