import { jwtVerify, SignJWT } from "jose";

// This module is imported by the middleware, so it must stay Edge-compatible:
// no Prisma, no next/headers.

export const SESSION_COOKIE_NAME = "admin-auth";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24; // 1 day
const MIN_SECRET_LENGTH = 32;

function getSecretKey(): Uint8Array | null {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    return null;
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(userId: string): Promise<string> {
  const key = getSecretKey();
  if (!key) {
    throw new Error(`AUTH_SECRET must be set to at least ${MIN_SECRET_LENGTH} characters`);
  }

  return new SignJWT()
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(key);
}

/**
 * Returns the user id from a valid session token, or null if the token is
 * missing, forged or expired, or if AUTH_SECRET is not configured.
 */
export async function verifySessionToken(token: string | undefined): Promise<string | null> {
  const key = getSecretKey();
  if (!key || !token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    sameSite: "lax" as const,
  };
}
