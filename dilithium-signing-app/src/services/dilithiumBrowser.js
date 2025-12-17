import { createDilithium } from "dilithium-crystals-js";

function ensureChromeRuntimeStub() {
  // ✅ Stub za web (da chrome.runtime.getURL ne puca)
  const g = window;

  g.chrome = g.chrome || {};
  g.chrome.runtime = g.chrome.runtime || {};

  if (typeof g.chrome.runtime.getURL !== "function") {
    g.chrome.runtime.getURL = (p) => {
      // Biblioteka često traži neku *.wasm putanju (nekad čak kyber.wasm)
      const name = String(p).split("/").pop();

      // Ako traži "kyber.wasm" ili nešto drugo, mi uvijek vraćamo tvoj dilithium.wasm
      // (možeš proširiti mapiranje po potrebi)
      if (name.endsWith(".wasm")) return `${window.location.origin}/dilithium.wasm`;

      // fallback
      return `${window.location.origin}/${name}`;
    };
  }

  // (Opcionalno) Ako wrapper koristi Module.locateFile
  g.Module = g.Module || {};
  if (typeof g.Module.locateFile !== "function") {
    g.Module.locateFile = (path) => {
      const name = String(path).split("/").pop();
      if (name.endsWith(".wasm")) return `${window.location.origin}/dilithium.wasm`;
      return `${window.location.origin}/${name}`;
    };
  }
}

async function fetchWasmBinary() {
  const res = await fetch("/dilithium.wasm");
  if (!res.ok) throw new Error(`WASM fetch failed: ${res.status} ${res.statusText}`);
  return await res.arrayBuffer();
}

let instancePromise = null;

export function getDilithium() {
  if (!instancePromise) {
    instancePromise = (async () => {
      ensureChromeRuntimeStub();

      // ✅ Učitaj wasm iz /public (tvoj fajl)
      const wasmBinary = await fetchWasmBinary();

      // Neke verzije createDilithium primaju wasmBinary, neke ne.
      // Ako tvoja ne prima, stub i locateFile će i dalje omogućiti da nađe wasm.
      try {
        return await createDilithium({ wasmBinary });
      } catch {
        return await createDilithium();
      }
    })();
  }
  return instancePromise;
}
