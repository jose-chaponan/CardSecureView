import { act, renderHook } from '@testing-library/react-native';
import { isTokenExpired, useSecureToken } from '../useSecureToken';

describe('isTokenExpired', () => {
  it('returns true for a token with a non-numeric timestamp', () => {
    expect(isTokenExpired('TOKEN-abc')).toBe(true);
  });

  it('returns true for a token older than 30 seconds', () => {
    const oldTimestamp = Math.floor(Date.now() / 1000) - 35;
    expect(isTokenExpired(`TOKEN-${oldTimestamp}`)).toBe(true);
  });

  it('returns false for a token generated right now', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(isTokenExpired(`TOKEN-${now}`)).toBe(false);
  });

  it('returns false for a token 29 seconds old (within TTL)', () => {
    const timestamp = Math.floor(Date.now() / 1000) - 29;
    expect(isTokenExpired(`TOKEN-${timestamp}`)).toBe(false);
  });

  it('returns true for a token exactly 31 seconds old (over TTL)', () => {
    const timestamp = Math.floor(Date.now() / 1000) - 31;
    expect(isTokenExpired(`TOKEN-${timestamp}`)).toBe(true);
  });

  it('returns true for a completely malformed token string', () => {
    expect(isTokenExpired('NOPREFIX')).toBe(true);
  });

  it('uses the last segment as timestamp (supports TOKEN-{cardId}-{ts} variants)', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(isTokenExpired(`TOKEN-card_1-${now}`)).toBe(false);
  });
});

describe('useSecureToken', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('getSecureToken resolves to a TOKEN-{timestamp} string', async () => {
    const { result } = renderHook(() => useSecureToken());
    let token!: string;
    await act(async () => {
      const promise = result.current.getSecureToken('card_1');
      jest.advanceTimersByTime(500);
      token = await promise;
    });
    expect(token).toMatch(/^TOKEN-\d+$/);
  });

  it('generated token is not expired immediately after creation', async () => {
    const { result } = renderHook(() => useSecureToken());
    let token!: string;
    await act(async () => {
      const promise = result.current.getSecureToken('card_1');
      jest.advanceTimersByTime(500);
      token = await promise;
    });
    expect(isTokenExpired(token)).toBe(false);
  });

  it('getSecureToken is stable across renders (same reference)', () => {
    const { result, rerender } = renderHook(() => useSecureToken());
    const first = result.current.getSecureToken;
    rerender({});
    expect(result.current.getSecureToken).toBe(first);
  });
});
