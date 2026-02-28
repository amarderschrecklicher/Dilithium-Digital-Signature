import { useState } from "react";
import { FileSignature, Lock, Download, CheckCircle } from "lucide-react";
import FileUploader from "./FileUploader";
import { signData } from "../services/dilithiumService";
import { readFileAsBytes } from "../services/fileService";
import { readFileAsText, parsePEMFile, createSignedFile } from "../utils/cryptoUtils";

const SigningPanel = ({ setError }) => {
  const [privateKeyFile, setPrivateKeyFile] = useState(null);
  const [signingMode, setSigningMode] = useState("text");
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [signature, setSignature] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePrivateKeySelect = (file) => {
    if (file && !file.name.endsWith(".pem")) {
      setError("Molimo odaberite .pem fajl za privatni ključ!");
      return;
    }
    setError("");
    setPrivateKeyFile(file);
  };

  const handleSignText = async () => {
    if (!privateKeyFile) {
      setError("Molimo učitajte privatni ključ (.pem fajl)!");
      return;
    }
    if (!message.trim()) {
      setError("Molimo unesite poruku koju želite potpisati!");
      return;
    }

    setLoading(true);
    setError("");
    setSignature("");

    try {
      const keyContent = await readFileAsText(privateKeyFile);
      const privateKeyRaw = parsePEMFile(keyContent);
      const messageBytes = new TextEncoder().encode(message);
      const sig = await signData(messageBytes, privateKeyRaw);
      setSignature(sig);
    } catch (err) {
      setError(err?.message || "Greška prilikom potpisivanja poruke.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignFile = async () => {
    if (!privateKeyFile) {
      setError("Molimo učitajte privatni ključ (.pem fajl)!");
      return;
    }
    if (!selectedFile) {
      setError("Molimo učitajte fajl koji želite potpisati!");
      return;
    }

    setLoading(true);
    setError("");
    setSignature("");

    try {
      const keyContent = await readFileAsText(privateKeyFile);
      const privateKeyRaw = parsePEMFile(keyContent);
      const fileBytes = await readFileAsBytes(selectedFile);
      const sig = await signData(fileBytes, privateKeyRaw);
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

  const downloadSignedData = async () => {
    if (!signature) return;

    try {
      if (signingMode === "text") {
        // For text: create embedded signed container
        const messageFile = new File([message], "message.txt", { type: 'text/plain' });
        const messageBytes = new TextEncoder().encode(message);
        const signedFileBytes = await createSignedFile(messageFile, messageBytes, signature);

        const blob = new Blob([signedFileBytes], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "message.signed";
        a.click();
        URL.revokeObjectURL(url);
      } else if (signingMode === "file" && selectedFile) {
        // For file: create embedded signed container
        const fileBytes = await readFileAsBytes(selectedFile);
        const signedFileBytes = await createSignedFile(selectedFile, fileBytes, signature);

        const blob = new Blob([signedFileBytes], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = selectedFile.name + ".signed";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError("Greška pri preuzimanju potpisanog fajla: " + err.message);
    }
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <FileSignature className="h-5 w-5" />
        <h3 className="text-lg font-semibold">2. Potpisivanje sadržaja</h3>
      </div>

      <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 p-3">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="h-4 w-4 text-blue-600" />
          <label className="text-sm font-medium text-blue-900">Privatni ključ (obavezno)</label>
        </div>
        <FileUploader
          selectedFile={privateKeyFile}
          setSelectedFile={handlePrivateKeySelect}
          id="signing-private-key"
          label="Odaberi .pem fajl sa privatnim ključem"
          accept=".pem"
        />
      </div>

      <div className="mb-4 flex gap-3">
        <button
          type="button"
          onClick={() => handleModeChange("text")}
          className={`flex-1 rounded-lg px-4 py-3 font-medium transition-all ${signingMode === "text"
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          📝 Tekstualna poruka
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("file")}
          className={`flex-1 rounded-lg px-4 py-3 font-medium transition-all ${signingMode === "file"
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

          {signature && (
            <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-900">Potpis uspješno kreiran!</h4>
              </div>
              <button
                type="button"
                onClick={downloadSignedData}
                className="w-full rounded-lg bg-green-600 hover:bg-green-700 py-2 text-white font-medium flex items-center justify-center gap-2 transition-all"
              >
                <Download className="h-4 w-4" />
                Preuzmi potpisanu poruku
              </button>
            </div>
          )}
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

          {signature && (
            <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-900">Uspješno potpisano!</h4>
              </div>
              <button
                type="button"
                onClick={downloadSignedData}
                className="w-full rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 py-3 px-6 text-white font-semibold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download size={20} className="animate-bounce" />
                <span>Preuzmi potpisani fajl</span>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default SigningPanel;
