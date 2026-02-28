import { PEM_HEADERS, ERROR_MESSAGES } from './constants';

/**
 * Validira da li fajl sadrži validan privatni ključ u PEM formatu
 */
export const validatePrivateKeyFile = (content) => {
  try {
    const trimmed = content.trim();
    
    // Provjera PEM headera
    if (!trimmed.includes(PEM_HEADERS.PRIVATE_KEY_BEGIN) || 
        !trimmed.includes(PEM_HEADERS.PRIVATE_KEY_END)) {
      return {
        valid: false,
        error: ERROR_MESSAGES.INVALID_PRIVATE_KEY
      };
    }

    // Izvlačenje base64 sadržaja između headera
    const lines = trimmed.split('\n');
    const base64Content = lines
      .filter(line => 
        !line.includes('-----BEGIN') && 
        !line.includes('-----END') &&
        line.trim().length > 0
      )
      .join('');

    // Provjera da li je validan base64
    if (!isValidBase64(base64Content)) {
      return {
        valid: false,
        error: ERROR_MESSAGES.INVALID_KEY_FORMAT
      };
    }

    // Pokušaj dekodiranja
    const decoded = base64ToArray(base64Content);
    
    // Provjera minimalne dužine ključa (Dilithium ključevi su dugi)
    if (decoded.length < 32) {
      return {
        valid: false,
        error: ERROR_MESSAGES.INVALID_PRIVATE_KEY
      };
    }

    return {
      valid: true,
      keyData: decoded,
      base64: base64Content
    };
  } catch (err) {
    return {
      valid: false,
      error: ERROR_MESSAGES.KEY_READ_FAILED + err.message
    };
  }
};

/**
 * Validira da li fajl sadrži validan javni ključ u PEM formatu
 */
export const validatePublicKeyFile = (content) => {
  try {
    const trimmed = content.trim();
    
    if (!trimmed.includes(PEM_HEADERS.PUBLIC_KEY_BEGIN) || 
        !trimmed.includes(PEM_HEADERS.PUBLIC_KEY_END)) {
      return {
        valid: false,
        error: ERROR_MESSAGES.INVALID_PUBLIC_KEY
      };
    }

    const lines = trimmed.split('\n');
    const base64Content = lines
      .filter(line => 
        !line.includes('-----BEGIN') && 
        !line.includes('-----END') &&
        line.trim().length > 0
      )
      .join('');

    if (!isValidBase64(base64Content)) {
      return {
        valid: false,
        error: ERROR_MESSAGES.INVALID_KEY_FORMAT
      };
    }

    const decoded = base64ToArray(base64Content);
    
    if (decoded.length < 32) {
      return {
        valid: false,
        error: ERROR_MESSAGES.INVALID_PUBLIC_KEY
      };
    }

    return {
      valid: true,
      keyData: decoded,
      base64: base64Content
    };
  } catch (err) {
    return {
      valid: false,
      error: ERROR_MESSAGES.KEY_READ_FAILED + err.message
    };
  }
};

/**
 * Provjera da li je string validan base64
 */
const isValidBase64 = (str) => {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
};

/**
 * Konverzija base64 u byte array
 */
const base64ToArray = (base64) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};