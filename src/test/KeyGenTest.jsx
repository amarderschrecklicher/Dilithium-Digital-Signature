import { useState } from "react";
import { Key, RotateCcw } from "lucide-react";
import { generateDilithiumKeyPair } from "../services/dilithiumService";
import { formatMs } from "./TestUtils";
import { COLORS } from "./TestUtils";
import { TestCard, StatBadge, RunLog } from "./TestUtils";

const KeyGenTest = ({ keyGen }) => {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(false);
  const color = COLORS.keygen;

  const run = async () => {
    setLoading(true);
    const t0 = performance.now();
    try {
      const keys = await generateDilithiumKeyPair(2);
      const ms = performance.now() - t0;
      keyGen(keys);
      setRuns((r) => [...r, { ms }]);
    } catch (err) {
      setRuns((r) => [...r, { error: err.message }]);
    } finally {
      setLoading(false);
    }
  };

  const avg = runs.filter(r => r.ms).length ? runs.filter(r => r.ms).reduce((a, b) => a + b.ms, 0) / runs.filter(r => r.ms).length : null;
  const last = runs.filter(r => r.ms).slice(-1)[0]?.ms ?? null;

  return (
    <TestCard icon={Key} title="Screen 1 — Key Generation" description="generateDilithiumKeyPair(2)" color={color}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "12px 0" }}>
        <StatBadge label="Last" value={formatMs(last)} color={color} />
        <StatBadge label="Avg" value={formatMs(avg)} color={color} />
        <StatBadge label="Runs" value={runs.length} color={color} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={run} disabled={loading} style={{ flex: 1, background: color.accent, color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
          {loading ? "⏳ Running…" : "▶ Run"}
        </button>
        <button onClick={() => { setRuns([]); }} style={{ background: "#fff", border: `1px solid ${color.border}`, borderRadius: 8, padding: "10px 14px", cursor: "pointer" }}>
          <RotateCcw size={14} color={color.accent} />
        </button>
      </div>
      <RunLog entries={runs} color={color} />
    </TestCard>
  );
};

export default KeyGenTest;