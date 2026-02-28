import { PEM_HEADERS, KEY_FORMATS } from '../utils/constants';

/**
 * Formatira ključ u PEM format
 */
const formatAsPEM = (keyData, isPrivate = true) => {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(keyData)));
  
  // Formatiranje sa prelomima na svakih 64 karaktera
  const formatted = base64.match(/.{1,64}/g).join('\n');
  
  const header = isPrivate ? PEM_HEADERS.PRIVATE_KEY_BEGIN : PEM_HEADERS.PUBLIC_KEY_BEGIN;
  const footer = isPrivate ? PEM_HEADERS.PRIVATE_KEY_END : PEM_HEADERS.PUBLIC_KEY_END;
  
  return `${header}\n${formatted}\n${footer}`;
};

/**
 * Sprema privatni ključ kao .pem fajl
 */
export const savePrivateKeyToFile = (keyData, filename = 'dilithium_private') => {
  const pemContent = formatAsPEM(keyData, true);
  const blob = new Blob([pemContent], { type: 'application/x-pem-file' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename + KEY_FORMATS.PRIVATE_KEY_EXTENSION;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Sprema javni ključ kao .pub fajl
 */
export const savePublicKeyToFile = (keyData, filename = 'dilithium_public') => {
  const pemContent = formatAsPEM(keyData, false);
  const blob = new Blob([pemContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename + KEY_FORMATS.PUBLIC_KEY_EXTENSION;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Čita sadržaj fajla kao tekst
 */
export const readKeyFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

/**
 * Parsira PEM fajl i izvlači ključ
 */
export const parsePEMFile = (pemContent, isPrivate = true) => {
  const header = isPrivate ? PEM_HEADERS.PRIVATE_KEY_BEGIN : PEM_HEADERS.PUBLIC_KEY_BEGIN;
  const footer = isPrivate ? PEM_HEADERS.PRIVATE_KEY_END : PEM_HEADERS.PUBLIC_KEY_END;
  
  const lines = pemContent.trim().split('\n');
  const base64Content = lines
    .filter(line => 
      !line.includes(header) && 
      !line.includes(footer) &&
      line.trim().length > 0
    )
    .join('');
  
  // Dekodiranje base64 u byte array
  const binaryString = atob(base64Content);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return bytes;
};