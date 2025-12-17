import React, { useState } from "react";
import { Key } from "lucide-react";

import MainMenu from "./components/MainMenu";
import KeyGenerator from "./components/KeyGenerator";
import SigningPanel from "./components/SigningPanel";
import VerificationPanel from "./components/VerificationPanel";

import { MODES } from "./utils/constants";
import { useDilithium } from "./services/dilithiumService";

function App() {
  // ✅ default potpisivanje (ali MainMenu možeš prikazati po želji)
  const [mode, setMode] = useState(MODES.SIGN);
  const [keyPair, setKeyPair] = useState(null);
  const [error, setError] = useState("");
  const { dilithiumLoaded } = useDilithium();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-4xl p-6">
        <header className="mb-6">
          <div className="flex items-center gap-2">
            <Key className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Dilithium Digital Signatur</h1>
          </div>
          <p className="mt-2 text-gray-700">
            Post-kvantna kriptografska šema za digitalno potpisivanje dokumenata
          </p>
        </header>

        {/* Back button je dio MainMenu komponente */}
        <MainMenu currentMode={mode} setCurrentMode={setMode} />

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
            {error}
          </div>
        )}

        {!dilithiumLoaded && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
            Učitavanje Dilithium biblioteke...
          </div>
        )}

        {/* Ako si u MENIJU, MainMenu već prikazuje opcije – ne prikazuj panele */}
        {mode === MODES.MENU ? null : (
          <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="mb-2 text-lg font-semibold">O Dilithium algoritmu</h2>
            <p className="text-gray-700">
              Dilithium je post-kvantna kriptografska šema digitalnog potpisa
              standardizovana od strane NIST-a kao dio FIPS 204 standarda.
              Dizajnirana je da bude otporna na napade kvantnih računara.
            </p>
          </section>
        )}

        {/* Aktivni prikaz */}
        <div className="grid gap-6">
          {mode === MODES.SIGN && (
            <>
              <SigningPanel
                keyPair={keyPair}
                setError={setError}
                disabled={!dilithiumLoaded || !keyPair}
              />

              {dilithiumLoaded && !keyPair && (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
                  Nemaš generisan par ključeva. Idi na <strong>Generiši ključeve</strong>{" "}
                  i kreiraj novi par, pa se vrati na potpisivanje.
                </div>
              )}
            </>
          )}

          {mode === MODES.VERIFY && (
            <VerificationPanel
              keyPair={keyPair}
              setError={setError}
              disabled={!dilithiumLoaded}
            />
          )}

          {mode === MODES.GENERATE && (
            <KeyGenerator
              setError={setError}
              onKeyPairGenerated={(kp) => {
                setKeyPair(kp);
                // opciono: automatski prebaci na potpisivanje nakon generisanja
                setMode(MODES.SIGN);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
