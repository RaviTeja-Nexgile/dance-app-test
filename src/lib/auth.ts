import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const SESSION_COOKIE = "dsp_session";

function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    // A stable fallback so the app runs without a .env file in development.
    return "dance-studio-pro-dev-secret";
  }
  return secret;
}

/**
 * Hash a plaintext password with bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Verify a plaintext password against a stored bcrypt hash.
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Build a signed session token for a user id. The token is the user id plus a
 * keyed HMAC so it cannot be forged without the session secret.
 */
export async function createSessionToken(userId: string): Promise<string> {
  const secret = sessionSecret();
  const key = await cryptoKey(secret);
  const data = new TextEncoder().encode(userId);
  const sig = await crypto.subtle.sign("HMAC", key, data);
  const sigHex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${userId}.${sigHex}`;
}

/**
 * Verify a session token and return the user id it encodes, or null when the
 * token is missing or invalid.
 */
export async function verifySessionToken(
  token: string,
): Promise<string | null> {
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;
  const userId = token.slice(0, dot);
  const sigHex = token.slice(dot + 1);
  const secret = sessionSecret();
  const key = await cryptoKey(secret);
  const data = new TextEncoder().encode(userId);
  const expected = await crypto.subtle.sign("HMAC", key, data);
  const expectedHex = Array.from(new Uint8Array(expected))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  if (sigHex !== expectedHex) return null;
  return userId;
}

async function cryptoKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder().encode(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    enc,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return key;
}

/**
 * Read the signed-in user id from the request cookies, or null when there is
 * no valid session. Used by server components and API routes to keep a User
 * signed in across requests (requirement 1.7).
 */
export async function getSessionUserId(): Promise<string | null> {
  const store = cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export { SESSION_COOKIE };
