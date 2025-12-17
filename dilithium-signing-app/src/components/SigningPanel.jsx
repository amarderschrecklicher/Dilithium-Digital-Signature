import React, { useState } from "react";
import { FileSignature } from "lucide-react";
import FileUploader from "./FileUploader";
import SignatureDisplay from "./SignatureDisplay";
import { signData } from "../services/dilithiumService";
import { readFileAsBytes } from "../services/fileService";
import { ERROR_MESSAGES } from "../utils/constants";

const SigningPanel = ({ keyPair, setError }) => {
  const [signingMode, setSigningMode] = useState("text");
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [signature, setSignature] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignText = async () => {
    console.log(keyPair);
    if (!keyPair) {
      alert(ERROR_MESSAGES.NO_KEYPAIR);
      return;
    }
    if (!message.trim()) {
      alert(ERROR_MESSAGES.NO_MESSAGE);
      return;
    }

    setLoading(true);
    setError("");
    setSignature("");

    try {
      const messageBytes = new TextEncoder().encode(message);
      const sig = await signData(messageBytes, keyPair.privateKeyRaw);
      setSignature(sig);
    } catch (err) {
      setError(err?.message || "Greška prilikom potpisivanja poruke.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignFile = async () => {
    if (!keyPair) {
      alert(ERROR_MESSAGES.NO_KEYPAIR);
      return;
    }
    if (!selectedFile) {
      alert(ERROR_MESSAGES.NO_FILE);
      return;
    }

    setLoading(true);
    setError("");
    setSignature("");

    try {
      const fileBytes = await readFileAsBytes(selectedFile);
      const sig = await signData(fileBytes, keyPair.privateKeyRaw);
      setSignature(sig);
    } catch (err) {
      setError(err?.message || "Greška prilikom potpisivanja fajla.");
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (mode) => {
    setSigningMode(mode);
    setSignature("");
    // optional: reset inputa kad promijeniš mode
    // setMessage("");
    // setSelectedFile(null);
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <FileSignature className="h-5 w-5" />
        <h3 className="text-lg font-semibold">2. Potpisivanje sadržaja</h3>
      </div>

      <div className="mb-4 flex gap-3">
        <button
          type="button"
          onClick={() => handleModeChange("text")}
          className={`flex-1 rounded-lg px-4 py-3 font-medium transition-all ${
            signingMode === "text"
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          📝 Tekstualna poruka
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("file")}
          className={`flex-1 rounded-lg px-4 py-3 font-medium transition-all ${
            signingMode === "file"
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          📄 Fajl (PDF, slika, dokument)
        </button>
      </div>

      {signingMode === "text" ? (
        <div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Unesite poruku koju želite potpisati..."
            className="mb-3 w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
            rows={4}
          />

          <button
            type="button"
            onClick={handleSignText}
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Potpisivanje..." : "Potpiši poruku"}
          </button>
        </div>
      ) : (
        <div>
          <FileUploader
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            id="sign-file-upload"
            label="Kliknite ili prevucite fajl za potpisivanje"
          />

          <button
            type="button"
            onClick={handleSignFile}
            disabled={loading}
            className="mt-3 w-full rounded-lg bg-indigo-600 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Potpisivanje..." : "Potpiši fajl"}
          </button>
        </div>
      )}

      {signature && (
        <div className="mt-4">
          <SignatureDisplay
            signature={signature}
            filename={signingMode === "file" ? selectedFile?.name : "message"}
          />
        </div>
      )}
    </section>
  );
};

export default SigningPanel;
