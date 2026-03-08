import { useState } from "react";
import { FileSignature, RotateCcw } from "lucide-react";
import { signData } from "../services/dilithiumService";
import { formatMs } from "./TestUtils";
import { COLORS } from "./TestUtils";
import { TestCard, StatBadge, RunLog } from "./TestUtils";

const SigningTest = ({sigSet, privateKey, setMsgSize, msgSize,setMsgBytes }) => {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(false);
  const color = COLORS.sign;

  const run = async () => {
    setLoading(true);
    const msgBytes = new Uint8Array(msgSize).map(() => Math.random() * 256);
    setMsgBytes(msgBytes);
    const t0 = performance.now();
    try {
      const signature = await signData(msgBytes, privateKey);
      const ms = performance.now() - t0;
      sigSet(signature);
      setRuns((r) => [...r, { ms, detail: `${msgSize} B` }]);
    } catch (err) {
      setRuns((r) => [...r, { error: err.message }]);
    } finally {
      setLoading(false);
    }
  };

  const avg = runs.filter(r => r.ms).length ? runs.filter(r => r.ms).reduce((a, b) => a + b.ms, 0) / runs.filter(r => r.ms).length : null;
  const last = runs.filter(r => r.ms).slice(-1)[0]?.ms ?? null;

  return (
    <TestCard icon={FileSignature} title="Screen 2 & 3 — Signing" description="signData(messageBytes / fileBytes, privateKey)" color={color}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "10px 0 4px" }}>
        <label style={{ fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}>Payload size:</label>
        <select value={msgSize} onChange={e => setMsgSize(+e.target.value)} style={{ flex: 1, borderRadius: 6, border: `1px solid ${color.border}`, padding: "4px 8px", fontSize: 13, background: "#fff" }}>
          <option value={64}>64 B (short text)</option>
          <option value={256}>256 B (paragraph)</option>
          <option value={10240}>10 KB (small file)</option>
          <option value={102400}>100 KB (medium file)</option>
          <option value={1048576}>1 MB (large file)</option>
          <option value={4*1048576}>4 MB (large file)</option>
        </select>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "12px 0" }}>
        <StatBadge label="Last" value={formatMs(last)} color={color} />
        <StatBadge label="Avg" value={formatMs(avg)} color={color} />
        <StatBadge label="Runs" value={runs.length} color={color} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={run} disabled={loading} style={{ flex: 1, background: color.accent, color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
          {loading ? "⏳ Running…" : "▶ Run"}
        </button>
        <button onClick={() => setRuns([])} style={{ background: "#fff", border: `1px solid ${color.border}`, borderRadius: 8, padding: "10px 14px", cursor: "pointer" }}>
          <RotateCcw size={14} color={color.accent} />
        </button>
      </div>
      <RunLog entries={runs} color={color} />
    </TestCard>
  );
};

export default SigningTest;