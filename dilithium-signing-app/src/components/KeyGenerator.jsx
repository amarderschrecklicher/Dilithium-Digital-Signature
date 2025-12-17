import { useState } from "react";
import { Download, Key } from "lucide-react";
import { generateDilithiumKeyPair } from "../services/dilithiumService";
import {
  savePrivateKeyToFile,
  savePublicKeyToFile,
} from "../services/keyManagementService";
import { SUCCESS_MESSAGES } from "../utils/constants";

const KeyGenerator = ({ setError, onKeyPairGenerated }) => {
  const [keyPair, setKeyPair] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateKeys = async () => {
    setLoading(true);
    setError("");

    try {
      const keys = await generateDilithiumKeyPair(2); // Dilithium2
      setKeyPair(keys);
      onKeyPairGenerated?.(keys);
      alert(SUCCESS_MESSAGES.KEYS_GENERATED);
    } catch (err) {
      setError(err?.message || "Greška prilikom generisanja ključeva.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPrivateKey = () => {
    if (!keyPair) return;
    savePrivateKeyToFile(keyPair.privateKeyRaw);
  };

  const handleDownloadPublicKey = () => {
    if (!keyPair) return;
    savePublicKeyToFile(keyPair.publicKeyRaw);
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Generisanje ključeva</h2>

      {!keyPair ? (
        <button
          onClick={handleGenerateKeys}
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 py-3 text-white"
        >
          {loading ? "Generisanje..." : "Generiši ključeve"}
        </button>
      ) : (
        <div className="space-y-3">
          <button
            onClick={handleDownloadPrivateKey}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-3 text-white"
          >
            <Download className="h-4 w-4" />
            Preuzmi privatni ključ
          </button>

          <button
            onClick={handleDownloadPublicKey}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-white"
          >
            <Download className="h-4 w-4" />
            Preuzmi javni ključ
          </button>
        </div>
      )}
    </section>
  );
};

export default KeyGenerator;
