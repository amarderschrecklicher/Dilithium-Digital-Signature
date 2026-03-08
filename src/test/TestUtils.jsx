import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";


export const mockDelay = (ms) => new Promise((r) => setTimeout(r, ms));

export const COLORS = {
  keygen: { bg: "#f0f4ff", border: "#c7d2fe", accent: "#4f46e5", badge: "#e0e7ff", text: "#3730a3" },
  sign:   { bg: "#f0fdf4", border: "#bbf7d0", accent: "#16a34a", badge: "#dcfce7", text: "#15803d" },
  verify: { bg: "#fdf4ff", border: "#e9d5ff", accent: "#9333ea", badge: "#f3e8ff", text: "#7e22ce" },
};

export const formatMs = (ms) => ms == null ? "—" : ms < 1000 ? `${ms.toFixed(1)} ms` : `${(ms / 1000).toFixed(2)} s`;

export const StatBadge = ({ label, value, color }) => (
  <div style={{ background: color.badge, border: `1px solid ${color.border}`, borderRadius: 8, padding: "6px 12px", display: "inline-flex", flexDirection: "column", alignItems: "center", minWidth: 90 }}>
    <span style={{ fontSize: 11, color: color.text, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
    <span style={{ fontSize: 16, fontWeight: 700, color: color.accent, fontFamily: "monospace" }}>{value}</span>
  </div>
);

export const RunLog = ({ entries, color }) => {
  const [open, setOpen] = useState(false);
  if (!entries.length) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", color: color.accent, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4, padding: 0 }}>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {entries.length} run{entries.length > 1 ? "s" : ""} logged
      </button>
      {open && (
        <div style={{ marginTop: 6, maxHeight: 160, overflowY: "auto", background: "#1e1e2e", borderRadius: 8, padding: "8px 12px" }}>
          {entries.map((e, i) => (
            <div key={i} style={{ fontFamily: "monospace", fontSize: 12, color: e.error ? "#f87171" : "#a3e635", padding: "2px 0", borderBottom: i < entries.length - 1 ? "1px solid #2d2d4e" : "none" }}>
              <span style={{ color: "#64748b", marginRight: 8 }}>#{i + 1}</span>
              {e.error ? `ERROR: ${e.error}` : formatMs(e.ms)}
              {e.detail && <span style={{ color: "#94a3b8", marginLeft: 8 }}>({e.detail})</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const TestCard = ({ icon: Icon, title, description, color, children }) => (
  <div style={{ background: color.bg, border: `1px solid ${color.border}`, borderRadius: 14, padding: 20 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
      <div style={{ background: color.badge, borderRadius: 8, padding: 6 }}>
        <Icon size={18} color={color.accent} />
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>{title}</div>
        <div style={{ fontSize: 12, color: "#64748b" }}>{description}</div>
      </div>
    </div>
    {children}
  </div>
);
