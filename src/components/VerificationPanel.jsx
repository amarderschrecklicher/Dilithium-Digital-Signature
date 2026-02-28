import React, { useState } from "react";
import { CheckCircle, XCircle, Globe } from "lucide-react";
import FileUploader from "./FileUploader";
import { verifySignature } from "../services/dilithiumService";
import { readFileAsBytes } from "../services/fileService";
import { readFileAsText, extractSignedFile } from "../utils/cryptoUtils";
import { parsePEMFile } from "../utils/cryptoUtils";

const VerificationPanel = ({ setError }) => {
  const [publicKeyFile, setPublicKeyFile] = useState(null);
  const [signedFile, setSignedFile] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePublicKeySelect = (file) => {
    if (file && !file.name.endsWith(".pub")) {
      setError("Molimo odaberite .pub fajl za javni ključ!");
      return;
    }
    setError("");
    setPublicKeyFile(file);
  };

  const handleVerify = async () => {
    if (!publicKeyFile) {
      setError("Molimo učitajte javni ključ (.pub fajl)!");
      return;
    }

    if (!signedFile) {
      setError("Molimo učitajte potpisani fajl!");
      return;
    }

    setLoading(true);
    setError("");
    setVerificationResult(null);

    try {
      const keyContent = await readFileAsText(publicKeyFile);
      const publicKeyRaw = parsePEMFile(keyContent);
      
      // Extract signature and file bytes from signed container
      const signedFileBytes = await readFileAsBytes(signedFile);
      const { fileBytes, signature } = await extractSignedFile(signedFileBytes);
      
      const isValid = await verifySignature(
        signature,
        fileBytes,
        publicKeyRaw
      );
      setVerificationResult(isValid);
    } catch (err) {
      setError(err.message || "Greška pri verifikaciji potpisa.");
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

      <div className="mb-4 rounded-lg bg-purple-50 border border-purple-200 p-3">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="h-4 w-4 text-purple-600" />
          <label className="text-sm font-medium text-purple-900">Javni ključ (obavezno)</label>
        </div>
        <FileUploader
          selectedFile={publicKeyFile}
          setSelectedFile={handlePublicKeySelect}
          id="verify-public-key"
          label="Odaberi .pub fajl sa javnim ključem"
          accept=".pub"
        />
      </div>

      <div className="mb-3">
        <label className="text-sm font-medium text-gray-700 block mb-2">Potpisani fajl</label>
        <FileUploader
          selectedFile={signedFile}
          setSelectedFile={setSignedFile}
          id="verify-signed-file-upload"
          label="Odaberi potpisani fajl (sa ugrađenim potpisom)"
        />
      </div>

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
