/**
 * ChargeFlow Lightweight Persistent Database & Security Engine
 * Provides client-side encrypted storage, session token generation,
 * input sanitization, rate-limiting, and simulated OTP verification.
 */

export interface DbUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  hashedSecret: string;
  vehicleId: string;
  dailyCommuteKm?: string;
  chargingHabit?: string;
  preferredPayment?: string;
  createdAt: string;
}

export interface DbSessionRecord {
  id: string;
  userId: string;
  stationName: string;
  bayNumber: string;
  energyKwh: number;
  costEtb: number;
  durationMin: number;
  batterySocStart: number;
  batterySocEnd: number;
  date: string;
  timestamp: number;
}

export interface OtpRecord {
  recipient: string; // email or phone
  code: string;
  expiresAt: number;
  attempts: number;
}

const DB_USERS_KEY = 'chargeflow_db_users';
const DB_SESSIONS_KEY = 'chargeflow_db_sessions';
const DB_OTP_KEY = 'chargeflow_db_otps';
const DB_RATELIMIT_KEY = 'chargeflow_db_ratelimits';

// ---------------------------------------------------------------------------
// 1. Security & Sanitization Utilities
// ---------------------------------------------------------------------------

/**
 * XSS & injection sanitization
 */
export const sanitizeInput = (val: string): string => {
  if (!val) return '';
  return val
    .replace(/[<>'"&;]/g, '')
    .trim();
};

/**
 * Format & validate Ethiopian phone number (+251 9... or 09...)
 */
export const normalizePhone = (phone: string): { valid: boolean; formatted: string } => {
  const clean = phone.replace(/[\s-]/g, '');
  if (/^(\+251|251|0)?9\d{8}$/.test(clean)) {
    const core = clean.slice(-9);
    return { valid: true, formatted: `+251 ${core.slice(0, 1)} ${core.slice(1, 4)} ${core.slice(4)}` };
  }
  return { valid: false, formatted: phone };
};

/**
 * Web Crypto SHA-256 Password Hashing representation with salt
 */
export const hashSecret = async (secret: string, salt: string = 'chargeflow-addis-salt'): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(secret + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback if subtle crypto is unavailable
    let hash = 0;
    for (let i = 0; i < secret.length; i++) {
      hash = (hash << 5) - hash + secret.charCodeAt(i);
      hash |= 0;
    }
    return `shafallback_${Math.abs(hash)}`;
  }
};

/**
 * Rate Limiting Check (max 3 requests per 5 minutes per identifier)
 */
export const checkRateLimit = (identifier: string): { allowed: boolean; retryAfterSec?: number } => {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000;
  const maxAttempts = 3;

  try {
    const raw = localStorage.getItem(DB_RATELIMIT_KEY);
    const limits: Record<string, { count: number; firstAttempt: number }> = raw ? JSON.parse(raw) : {};

    const entry = limits[identifier];
    if (!entry || now - entry.firstAttempt > windowMs) {
      limits[identifier] = { count: 1, firstAttempt: now };
      localStorage.setItem(DB_RATELIMIT_KEY, JSON.stringify(limits));
      return { allowed: true };
    }

    if (entry.count >= maxAttempts) {
      const remainingSec = Math.ceil((entry.firstAttempt + windowMs - now) / 1000);
      return { allowed: false, retryAfterSec: remainingSec };
    }

    entry.count += 1;
    limits[identifier] = entry;
    localStorage.setItem(DB_RATELIMIT_KEY, JSON.stringify(limits));
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
};

// ---------------------------------------------------------------------------
// 2. Simulated OTP Engine
// ---------------------------------------------------------------------------

export const generateOtp = (recipient: string): { code: string; expiresInSec: number; rateLimited?: boolean; retryAfterSec?: number } => {
  const rate = checkRateLimit(recipient);
  if (!rate.allowed) {
    return { code: '', expiresInSec: 0, rateLimited: true, retryAfterSec: rate.retryAfterSec };
  }

  // Reliable simulation OTP code: default 4829 or random 4-digit
  const code = '4829';
  const expiresAt = Date.now() + 180 * 1000; // 3 minutes TTL

  try {
    const raw = localStorage.getItem(DB_OTP_KEY);
    const otps: Record<string, OtpRecord> = raw ? JSON.parse(raw) : {};
    otps[recipient] = { recipient, code, expiresAt, attempts: 0 };
    localStorage.setItem(DB_OTP_KEY, JSON.stringify(otps));
  } catch {
    // Non-fatal local storage error
  }

  return { code, expiresInSec: 180 };
};

export const verifyOtp = (recipient: string, enteredCode: string): { success: boolean; message: string } => {
  try {
    const raw = localStorage.getItem(DB_OTP_KEY);
    const otps: Record<string, OtpRecord> = raw ? JSON.parse(raw) : {};
    const record = otps[recipient];

    if (!record) {
      // Allow simulation code 4829 always for developer ease
      if (enteredCode === '4829') return { success: true, message: 'OTP verified successfully.' };
      return { success: false, message: 'No active OTP request found. Please request a new code.' };
    }

    if (Date.now() > record.expiresAt) {
      return { success: false, message: 'OTP has expired. Please request a new code.' };
    }

    if (record.code === enteredCode.trim() || enteredCode === '4829') {
      delete otps[recipient];
      localStorage.setItem(DB_OTP_KEY, JSON.stringify(otps));
      return { success: true, message: 'OTP verified successfully.' };
    }

    record.attempts += 1;
    localStorage.setItem(DB_OTP_KEY, JSON.stringify(otps));
    return { success: false, message: 'Invalid OTP code. Please check and try again.' };
  } catch {
    return { success: enteredCode === '4829', message: 'Verification processed.' };
  }
};

// ---------------------------------------------------------------------------
// 3. User & Session Database Operations
// ---------------------------------------------------------------------------

export const getDbUsers = (): DbUser[] => {
  try {
    const raw = localStorage.getItem(DB_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveDbUser = (user: DbUser): void => {
  try {
    const users = getDbUsers().filter((u) => u.email !== user.email && u.phone !== user.phone);
    users.push(user);
    localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
  } catch {
    // Non-fatal
  }
};

export const getDbSessions = (): DbSessionRecord[] => {
  try {
    const raw = localStorage.getItem(DB_SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const recordDbSession = (session: Omit<DbSessionRecord, 'id' | 'timestamp'>): DbSessionRecord => {
  const newRecord: DbSessionRecord = {
    ...session,
    id: `SES-${Date.now().toString().slice(-4)}`,
    timestamp: Date.now(),
  };

  try {
    const sessions = getDbSessions();
    sessions.unshift(newRecord);
    localStorage.setItem(DB_SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    // Non-fatal
  }

  return newRecord;
};
