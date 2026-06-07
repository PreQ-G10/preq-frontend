import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockGetAccessToken = vi.fn();
const mockGetRefreshToken = vi.fn();
const mockSaveTokens = vi.fn();
const mockClearTokens = vi.fn();

vi.mock('@/utils/tokenStorage', () => ({
  tokenStorage: {
    getAccessToken: mockGetAccessToken,
    getRefreshToken: mockGetRefreshToken,
    saveTokens: mockSaveTokens,
    clearTokens: mockClearTokens,
  },
}));

vi.mock('@/constants/api', () => ({
  API: {
    endpoints: {
      refreshToken: 'http://localhost/api/auth/refresh-token',
    },
  },
}));

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const { fetchAuthenticated, handleResponse, authService } = await import('@/services/api');

function mockResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

// ── handleResponse ─────────────────────────────────────────────────────────

describe('handleResponse', () => {
  it('throws on a non-ok response', async () => {
    await expect(handleResponse(mockResponse(404, {}))).rejects.toThrow('HTTP 404');
  });

  it('throws with the correct status code', async () => {
    await expect(handleResponse(mockResponse(500, {}))).rejects.toThrow('HTTP 500');
  });

  it('returns parsed JSON on an ok response', async () => {
    const result = await handleResponse(mockResponse(200, { id: 1, name: 'Test' }));
    expect(result).toEqual({ id: 1, name: 'Test' });
  });
});

// ── fetchAuthenticated ─────────────────────────────────────────────────────

describe('fetchAuthenticated', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('attaches Authorization header when token exists', async () => {
    mockGetAccessToken.mockResolvedValue('my-access-token');
    mockFetch.mockResolvedValue(mockResponse(200, {}));

    await fetchAuthenticated('http://localhost/api/test');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost/api/test',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer my-access-token',
        }),
      })
    );
  });

  it('does not attach Authorization header when no token', async () => {
    mockGetAccessToken.mockResolvedValue(null);
    mockFetch.mockResolvedValue(mockResponse(200, {}));

    await fetchAuthenticated('http://localhost/api/test');

    const callHeaders = mockFetch.mock.calls[0][1].headers;
    expect(callHeaders).not.toHaveProperty('Authorization');
  });

  it('retries with new token after 401', async () => {
    mockGetAccessToken
      .mockResolvedValueOnce('expired-token')
      .mockResolvedValueOnce('new-token');

    mockFetch
      .mockResolvedValueOnce(mockResponse(401, {}))
      .mockResolvedValueOnce(mockResponse(200, { accessToken: 'new-token', refreshToken: 'new-refresh' }))
      .mockResolvedValueOnce(mockResponse(200, { id: 1 }));

    mockSaveTokens.mockResolvedValue(undefined);
    mockGetRefreshToken.mockResolvedValue('refresh-token');

    await fetchAuthenticated('http://localhost/api/test');

    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(mockFetch.mock.calls[2][1].headers).toMatchObject({
      Authorization: 'Bearer new-token',
    });
  });

  it('throws SESSION_EXPIRED when refresh fails after 401', async () => {
    mockGetAccessToken.mockResolvedValue('expired-token');
    mockGetRefreshToken.mockResolvedValue('refresh-token');

    mockFetch
      .mockResolvedValueOnce(mockResponse(401, {}))
      .mockResolvedValueOnce(mockResponse(401, {}));

    await expect(
      fetchAuthenticated('http://localhost/api/test')
    ).rejects.toThrow('SESSION_EXPIRED');
  });
});

// ── authService.refresh ────────────────────────────────────────────────────

describe('authService.refresh', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns false when no refresh token is stored', async () => {
    mockGetRefreshToken.mockResolvedValue(null);
    const result = await authService.refresh();
    expect(result).toBe(false);
  });

  it('clears tokens and returns false when refresh request fails', async () => {
    mockGetRefreshToken.mockResolvedValue('old-refresh-token');
    mockFetch.mockResolvedValue(mockResponse(401, {}));
    mockClearTokens.mockResolvedValue(undefined);

    const result = await authService.refresh();

    expect(result).toBe(false);
    expect(mockClearTokens).toHaveBeenCalledTimes(1);
  });

  it('saves new tokens and returns true on successful refresh', async () => {
    mockGetRefreshToken.mockResolvedValue('old-refresh-token');
    mockFetch.mockResolvedValue(mockResponse(200, {
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
    }));
    mockSaveTokens.mockResolvedValue(undefined);

    const result = await authService.refresh();

    expect(result).toBe(true);
    expect(mockSaveTokens).toHaveBeenCalledWith('new-access', 'new-refresh');
  });
});