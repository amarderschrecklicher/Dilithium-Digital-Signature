export const DILITHIUM_CDN = 'https://cdn.jsdelivr.net/npm/dilithium-crystals@1.0.0/dist/dilithium.min.js';

// Formati fajlova za ključeve
export const KEY_FORMATS = {
  PRIVATE_KEY_EXTENSION: '.pem',
  PUBLIC_KEY_EXTENSION: '.pub',
  SIGNATURE_EXTENSION: '.sig'
};

// PEM format headers
export const PEM_HEADERS = {
  PRIVATE_KEY_BEGIN: '-----BEGIN DILITHIUM PRIVATE KEY-----',
  PRIVATE_KEY_END: '-----END DILITHIUM PRIVATE KEY-----',
  PUBLIC_KEY_BEGIN: '-----BEGIN DILITHIUM PUBLIC KEY-----',
  PUBLIC_KEY_END: '-----END DILITHIUM PUBLIC KEY-----'
};

export const MODES = {
  MENU: "menu",
  SIGN: "sign",
  VERIFY: "verify",
  GENERATE: "keys",
};

export const ERROR_MESSAGES = {
  NO_PRIVATE_KEY: 'Prvo učitajte privatni ključ (.pem fajl)!',
  NO_PUBLIC_KEY: 'Prvo učitajte javni ključ (.pub fajl)!',
  INVALID_KEY_FORMAT: 'Nevažeći format ključa! Molimo učitajte validan PEM fajl.',
  INVALID_PRIVATE_KEY: 'Fajl ne sadrži validan Dilithium privatni ključ!',
  INVALID_PUBLIC_KEY: 'Fajl ne sadrži validan Dilithium javni ključ!',
  NO_MESSAGE: 'Unesite sadržaj za potpisivanje!',
  NO_FILE: 'Odaberite fajl za potpisivanje!',
  NO_VERIFICATION_DATA: 'Unesite fajl i potpis za verifikaciju!',
  LIBRARY_LOAD_FAILED: 'Greška pri učitavanju Dilithium biblioteke. Koristim simulaciju.',
  KEY_GENERATION_FAILED: 'Greška pri generisanju ključeva: ',
  SIGNING_FAILED: 'Greška pri potpisivanju: ',
  VERIFICATION_FAILED: 'Greška pri verifikaciji: ',
  KEY_READ_FAILED: 'Greška pri čitanju ključa: '
};

export const SUCCESS_MESSAGES = {
  COPIED: 'Kopirano u clipboard!',
  KEYS_GENERATED: 'Ključevi uspješno generisani!',
  KEY_LOADED: 'Ključ uspješno učitan!',
  SIGNATURE_VALID: 'Potpis je validan! ✓',
  SIGNATURE_INVALID: 'Potpis nije validan! ✗'
};