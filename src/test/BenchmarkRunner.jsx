import { useState, useRef } from "react";
import { Zap } from "lucide-react";
import { generateDilithiumKeyPair, signData, verifySignature } from "../services/dilithiumService";
import { formatMs } from "./TestUtils";


const BenchmarkRunner = () => {
  const [n, setN] = useState(5);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);
  const stopRef = useRef(false);

  const runBenchmark = async () => {
    stopRef.current = false;
    setRunning(true);
    setResults(null);

    const ops = {
      keygen: [],
      sign: [],
      verify: [],
    };

    const msg = new Uint8Array(256).map(() => Math.random() * 256);
    const dummyKey = new Uint8Array(32);

    for (let i = 0; i < n; i++) {
      if (stopRef.current) break;

      let t = performance.now();
      await generateDilithiumKeyPair(2);
      ops.keygen.push(performance.now() - t);

      t = performance.now();
      const sig = await signData(msg, dummyKey);
      ops.sign.push(performance.now() - t);

      t = performance.now();
      await verifySignature(sig, msg, dummyKey);
      ops.verify.push(performance.now() - t);
    }

    const stat = (arr) => ({
      min: Math.min(...arr),
      max: Math.max(...arr),
      avg: arr.reduce((a, b) => a + b, 0) / arr.length,
    });

    setResults({ keygen: stat(ops.keygen), sign: stat(ops.sign), verify: stat(ops.verify) });
    setRunning(false);
  };

  return (
    <div style={{ background: "#0f172a", borderRadius: 14, padding: 20, color: "#e2e8f0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <Zap size={18} color="#fbbf24" />
        <span style={{ fontWeight: 700, fontSize: 15 }}>Automated Benchmark</span>
        <span style={{ fontSize: 12, color: "#64748b" }}>— runs all operations N times</span>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
        <label style={{ fontSize: 13, color: "#94a3b8" }}>Iterations:</label>
        {[3, 5, 10, 20].map(v => (
          <button key={v} onClick={() => setN(v)} style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #334155", background: n === v ? "#4f46e5" : "#1e293b", color: n === v ? "#fff" : "#94a3b8", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>{v}</button>
        ))}
        <button onClick={running ? () => stopRef.current = true : runBenchmark} style={{ marginLeft: "auto", padding: "8px 20px", borderRadius: 8, border: "none", background: running ? "#dc2626" : "#4f46e5", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
          {running ? "⏹ Stop" : "▶ Run Benchmark"}
        </button>
      </div>

      {running && (
        <div style={{ textAlign: "center", padding: "20px 0", color: "#94a3b8", fontSize: 13 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
          Benchmarking… ({n} iterations)
        </div>
      )}

      {results && (
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "monospace", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e293b" }}>
              {["Operation", "Min", "Avg", "Max"].map(h => (
                <th key={h} style={{ textAlign: h === "Operation" ? "left" : "right", padding: "6px 10px", color: "#64748b", fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Key Generation", key: "keygen", color: "#818cf8" },
              { label: "Signing", key: "sign", color: "#4ade80" },
              { label: "Verification", key: "verify", color: "#c084fc" },
            ].map(({ label, key, color }) => (
              <tr key={key} style={{ borderBottom: "1px solid #1e293b" }}>
                <td style={{ padding: "8px 10px", color }}>{label}</td>
                <td style={{ padding: "8px 10px", textAlign: "right", color: "#e2e8f0" }}>{formatMs(results[key].min)}</td>
                <td style={{ padding: "8px 10px", textAlign: "right", color: "#f8fafc", fontWeight: 700 }}>{formatMs(results[key].avg)}</td>
                <td style={{ padding: "8px 10px", textAlign: "right", color: "#e2e8f0" }}>{formatMs(results[key].max)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BenchmarkRunner;