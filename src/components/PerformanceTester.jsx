import KeyGenTest from "../test/KeyGenTest";
import SigningTest from "../test/SigningTest";
import VerifyTest from "../test/VerifyTest";
import BenchmarkRunner from "../test/BenchmarkRunner";
import { Timer } from "lucide-react";
import { useState } from "react";

export default function PerformanceTester() {
  const [signature, setSignature] = useState("");
  const [keyPair, setKeyPair] = useState(null);
  const [msgSize, setMsgSize] = useState(256);
  const [msgBytes, setMsgBytes] = useState(null);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <Timer size={22} color="#4f46e5" />
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: "#1e293b" }}>Dilithium Performance Tester</h1>
      </div>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>
        Click <strong>▶ Run</strong> on each card to measure individual operation timing. Use <strong>Automated Benchmark</strong> for statistical results across N runs.
        <br />
        <span style={{ color: "#f59e0b" }}></span>
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <KeyGenTest  keyGen = {setKeyPair}/>
        <SigningTest sigSet = {setSignature} privateKey = {keyPair? keyPair.privateKeyRaw : null } setMsgSize = {setMsgSize} msgSize = {msgSize} setMsgBytes={setMsgBytes}/>
        <VerifyTest  sig = {signature} publicKey = {keyPair?keyPair.publicKeyRaw:null } msgSize = {msgSize} msgBytes={msgBytes}/>
        <BenchmarkRunner />
      </div>
    </div>
  );
}