import { describe, expect, it } from 'vitest';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function makeToken(expOffsetSeconds: number): string {
  const payload = { exp: Math.floor(Date.now() / 1000) + expOffsetSeconds };
  const encoded = btoa(JSON.stringify(payload));
  return `header.${encoded}.signature`;
}

describe('isTokenExpired', () => {
  it('returns false for a valid non-expired token', () => {
    expect(isTokenExpired(makeToken(3600))).toBe(false);
  });

  it('returns true for an expired token', () => {
    expect(isTokenExpired(makeToken(-3600))).toBe(true);
  });

  it('returns true for a malformed token', () => {
    expect(isTokenExpired('not.a.token')).toBe(true);
  });

  it('returns true for an empty string', () => {
    expect(isTokenExpired('')).toBe(true);
  });
});