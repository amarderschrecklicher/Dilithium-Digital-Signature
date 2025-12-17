import React, { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import FileUploader from "./FileUploader";
import { verifySignature } from "../services/dilithiumService";
import { readFileAsBytes } from "../services/fileService";
import { ERROR_MESSAGES } from "../utils/constants";

const VerificationPanel = ({ keyPair, setError }) => {
  const [verificationFile, setVerificationFile] = useState(null);
  const [verificationSignature, setVerificationSignature] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!keyPair) {
      alert(ERROR_MESSAGES.NO_KEYPAIR);
      return;
    }

    if (!verificationFile || !verificationSignature.trim()) {
      alert(ERROR_MESSAGES.NO_VERIFICATION_DATA);
      return;
    }

    setLoading(true);
    setError("");
    setVerificationResult(null);

    try {
      const fileBytes = await readFileAsBytes(verificationFile);
      const isValid = await verifySignature(
        verificationSignature,
        fileBytes,
        keyPair.publicKeyRaw
      );
      setVerificationResult(isValid);
    } catch (err) {
      setError(err.message);
      setVerificationResult(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-lg font-semibold">
        3. Verifikacija potpisa
      </h3>

      <FileUploader
        label="Odaberite fajl za verifikaciju"
        onFileSelect={setVerificationFile}
      />

      <textarea
        value={verificationSignature}
        onChange={(e) => setVerificationSignature(e.target.value)}
        placeholder="Zalijepite potpis za verifikaciju..."
        className="mt-3 w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
        rows={3}
      />

      <button
        onClick={handleVerify}
        disabled={loading}
        className="mt-3 w-full rounded-lg bg-indigo-600 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Verifikacija..." : "Verifikuj potpis"}
      </button>

      {verificationResult !== null && (
        <div
          className={`mt-4 flex items-center gap-2 rounded-lg p-3 ${
            verificationResult
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {verificationResult ? (
            <>
              <CheckCircle className="h-5 w-5" />
              <span>Potpis je validan ✓</span>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5" />
              <span>Potpis nije validan ✗</span>
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default VerificationPanel;
