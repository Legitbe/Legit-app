// ============================================================
// Legit — Anonymous Device Fingerprint
// Generates a random UUID on first visit, stores in localStorage.
// No personal data is collected — purely session-based anonymity.
// ============================================================

import { DEVICE_ID_KEY } from './constants';

/**
 * Get or create a persistent anonymous device identifier.
 * Stored in localStorage under 'legit_device_id'.
 */
export function getDeviceFingerprint(): string {
  if (typeof window === 'undefined') {
    return 'server-side';
  }

  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
}
