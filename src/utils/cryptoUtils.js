
import { PEM_HEADERS } from "./constants.js";
/**
 * Kopira tekst u clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Greška pri kopiranju:', err);
    return false;
  }
};

/**
 * Preuzima tekst kao fajl
 */
export const downloadAsFile = (content, filename) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const arrayToHex = (arr) => {
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
};

export const hexToArray = (hex) => {
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    arr[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return arr;
};

export const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

export const readFileAsBytes = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(new Uint8Array(e.target.result));
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const parsePEMFile = (pemContent) => {
  const lines = pemContent.trim().split('\n');
  const base64Content = lines
    .filter(line => 
      !line.includes('-----BEGIN') && 
      !line.includes('-----END') &&
      line.trim().length > 0
    )
    .join('');
  
  const binaryString = atob(base64Content);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const formatAsPEM = (keyData, isPrivate = true) => {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(keyData)));
  const formatted = base64.match(/.{1,64}/g).join('\n');
  const header = isPrivate ? PEM_HEADERS.PRIVATE_KEY_BEGIN : PEM_HEADERS.PUBLIC_KEY_BEGIN;
  const footer = isPrivate ? PEM_HEADERS.PRIVATE_KEY_END : PEM_HEADERS.PUBLIC_KEY_END;
  return `${header}\n${formatted}\n${footer}`;
};

// Embed signature in file - creates a container format
export const createSignedFile = async (originalFile, fileBytes, signature) => {
  const encoder = new TextEncoder();

  
  // Header marker
  const header = encoder.encode('DIGI_SIGN_v1');
  
  // Original filename
  const filenameBytes = encoder.encode(originalFile.name);
  const filenameLength = new Uint32Array([filenameBytes.length]);
  
  // File size
  const fileSize = new Uint32Array([fileBytes.length]);
  
  // Signature size
  const signatureBytes = encoder.encode(signature);
  const signatureSize = new Uint32Array([signatureBytes.length]);
  
  // Combine all parts
  const totalSize = 
    header.length + 
    4 + filenameBytes.length + 
    4 + fileBytes.length + 
    4 + signatureBytes.length;
  
  const result = new Uint8Array(totalSize);
  let offset = 0;
  
  // Write header
  result.set(header, offset);
  offset += header.length;
  
  // Write filename length and filename
  result.set(new Uint8Array(filenameLength.buffer), offset);
  offset += 4;
  result.set(filenameBytes, offset);
  offset += filenameBytes.length;
  
  // Write file size and file bytes
  result.set(new Uint8Array(fileSize.buffer), offset);
  offset += 4;
  result.set(fileBytes, offset);
  offset += fileBytes.length;
  
  // Write signature size and signature
  result.set(new Uint8Array(signatureSize.buffer), offset);
  offset += 4;
  result.set(signatureBytes, offset);
  
  return result;
};

// Extract signature and original file from signed container
export const extractSignedFile = async (signedBytes) => {
  const decoder = new TextDecoder();

  let offset = 0;
  
  // Read header
  const header = decoder.decode(signedBytes.slice(offset, offset + 12));
  if (header !== 'DIGI_SIGN_v1') {
    throw new Error('Invalid signed file format');
  }
  offset += 12;
  
  // Read filename length and filename
  const filenameLengthBytes = signedBytes.slice(offset, offset + 4);
  const filenameLength = new Uint32Array(filenameLengthBytes.buffer)[0];
  offset += 4;
  
  const filename = decoder.decode(signedBytes.slice(offset, offset + filenameLength));
  offset += filenameLength;
  
  // Read file size and file bytes
  const fileSizeBytes = signedBytes.slice(offset, offset + 4);
  const fileSize = new Uint32Array(fileSizeBytes.buffer)[0];
  offset += 4;
  
  const fileBytes = signedBytes.slice(offset, offset + fileSize);
  offset += fileSize;
  
  // Read signature size and signature
  const signatureSizeBytes = signedBytes.slice(offset, offset + 4);
  const signatureSize = new Uint32Array(signatureSizeBytes.buffer)[0];
  offset += 4;
  
  const signatureBytes = signedBytes.slice(offset, offset + signatureSize);
  const signature = decoder.decode(signatureBytes);
  
  return {
    filename,
    fileBytes,
    signature
  };
};