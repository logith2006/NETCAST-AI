/**
 * NetCast AI - SHA-256 Security Service
 * Uses Web Crypto API (browser built-in, no external libraries)
 * Interview Answer Q4: SHA-256 hash, not plain text storage
 */

/**
 * Hash a string using SHA-256 via Web Crypto API
 * This is the same algorithm used by banks and telecom systems
 * @param {string} message - plain text to hash
 * @returns {Promise<string>} hex-encoded SHA-256 hash
 */
export async function sha256Hash(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Verify a password against stored SHA-256 hash
 */
export async function verifyPassword(inputPassword, storedHash) {
  const inputHash = await sha256Hash(inputPassword);
  return inputHash === storedHash;
}

/**
 * Generate a secure session token (UUID v4 style)
 */
export function generateSessionToken() {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  const hex = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-4${hex.slice(13,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
