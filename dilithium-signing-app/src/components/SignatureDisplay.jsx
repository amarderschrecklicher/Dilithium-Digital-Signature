import React, { useState } from "react";
import { generateDilithiumKeyPair } from "../services/dilithiumService";
import { copyToClipboard } from "../utils/cryptoUtils";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../utils/constants";

const KeyGenerator = ({ keyPair, setKeyPair, setError }) => {
  const [loading, setLoading] = useState(false);

  const handleGenerateKeys = async () => {
    setLoading(true);
    setError("");

    try {
      const keys = await generateDilithiumKeyPair();
      setKeyPair(keys);
    } catch (err) {
      setError(err?.message || ERROR_MESSAGES.GENERIC_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text) => {
    if (!text) return;
    const success = await copyToClipboard(text);
    if (success) alert(SUCCESS_MESSAGES.COPIED);
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-lg font-semibold">1. Generisanje para ključeva</h3>

      <button
        onClick={handleGenerateKeys}
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Generisanje..." : "Generiši novi par ključeva"}
      </button>

      {!keyPair && (
        <p className="mt-3 text-sm text-gray-600">
          Generiši ključeve da bi mogao potpisivati i verifikovati fajlove.
        </p>
      )}

      {keyPair && (
        <div className="mt-4 space-y-4">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium">Javni ključ:</span>
              <button
                onClick={() => handleCopy(keyPair.publicKey)}
                className="text-xs text-indigo-600 hover:text-indigo-800"
              >
                Kopiraj
              </button>
            </div>
            <textarea
              readOnly
              value={keyPair.publicKey}
              className="w-full rounded-lg border border-gray-300 p-2 text-xs"
              rows={4}
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium">Privatni ključ:</span>
              <button
                onClick={() => handleCopy(keyPair.privateKey)}
                className="text-xs text-indigo-600 hover:text-indigo-800"
              >
                Kopiraj
              </button>
            </div>
            <textarea
              readOnly
              value={keyPair.privateKey}
              className="w-full rounded-lg border border-gray-300 p-2 text-xs"
              rows={4}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default KeyGenerator;
