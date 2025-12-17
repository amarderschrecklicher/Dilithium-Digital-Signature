import { useEffect, useState } from "react";
import { arrayToHex, hexToArray } from "../utils/cryptoUtils";
import { ERROR_MESSAGES } from "../utils/constants";
import { getDilithium } from "./dilithiumBrowser";

export const useDilithium = () => {
  const [dilithiumLoaded, setDilithiumLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getDilithium()
      .then(() => {
        if (!cancelled) setDilithiumLoaded(true);
      })
      .catch((e) => {
        console.warn(ERROR_MESSAGES.LIBRARY_LOAD_FAILED, e);
        if (!cancelled) setDilithiumLoaded(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { dilithiumLoaded };
};

export const generateDilithiumKeyPair = async (kind = 2) => {
  try {
    const dilithium = await getDilithium();
    const { publicKey, privateKey } = dilithium.generateKeys(kind);

    return {
      kind,
      publicKeyRaw: publicKey,
      privateKeyRaw: privateKey,
      publicKey: arrayToHex(publicKey),
      privateKey: arrayToHex(privateKey),
    };
  } catch (err) {
    throw new Error(
      ERROR_MESSAGES.KEY_GENERATION_FAILED + (err?.message ? " " + err.message : "")
    );
  }
};

export const signData = async (dataBytes, privateKeyRaw, kind = 2) => {
  try {
    const dilithium = await getDilithium();
    const { signature } = dilithium.sign(dataBytes, privateKeyRaw, kind);
    return arrayToHex(signature);
  } catch (err) {
    throw new Error(
      ERROR_MESSAGES.SIGNING_FAILED + (err?.message ? " " + err.message : "")
    );
  }
};

export const verifySignature = async (signatureHex, dataBytes, publicKeyRaw, kind = 2) => {
  try {
    const dilithium = await getDilithium();
    const signatureBytes = hexToArray(signatureHex);
    const v = dilithium.verify(signatureBytes, dataBytes, publicKeyRaw, kind);
    return v?.result === 0;
  } catch (err) {
    throw new Error(
      ERROR_MESSAGES.VERIFICATION_FAILED + (err?.message ? " " + err.message : "")
    );
  }
};
