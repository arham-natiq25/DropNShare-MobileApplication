/**
 * API client for DropNShare backend (Laravel + Sanctum).
 * Uses fetch with optional Bearer token; token persisted via AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const AUTH_TOKEN_KEY = '@dropnshare/auth_token';

// Production / test URL (no trailing slash). Set via:
// 1) .env: EXPO_PUBLIC_API_URL=https://your-api.com/api
// 2) app.json extra: "expo": { "extra": { "apiUrl": "https://your-api.com/api" } }
const extra = Constants.expoConfig?.extra as { apiUrl?: string } | undefined;

// Use HTTPS. http:// causes redirect to https:// and that turns POST into GET → "GET method not supported".
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  'https://arhamnatiq.dropnsharee.com/api';

// Laravel api.php routes use no trailing slash. If you get 404, set to true.
const API_USE_TRAILING_SLASH = false;

const LOG = (msg: string, data?: unknown) => {
  if (__DEV__) {
    if (data !== undefined) console.log('[API]', msg, data);
    else console.log('[API]', msg);
  }
};

// Log resolved base URL at load (helps debug .env / app.json)
LOG('API_BASE_URL', API_BASE_URL);

export async function getStoredToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setStoredToken(token: string | null): Promise<void> {
  try {
    if (token) await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    else await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {}
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type ApiRequestOptions = {
  method?: HttpMethod | string;
  headers?: Record<string, string>;
  body?: object;
  formData?: FormData;
};

async function request<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<{ data?: T; error?: string; status: number }> {
  const { body, formData, method: optMethod, headers: restHeaders } = options;
  const method: HttpMethod = (optMethod?.toUpperCase() ?? 'GET') as HttpMethod;
  const pathNorm = path.replace(/^\//, '').replace(/\/$/, '');
  const url = API_USE_TRAILING_SLASH
    ? `${API_BASE_URL.replace(/\/$/, '')}/${pathNorm}/`
    : `${API_BASE_URL.replace(/\/$/, '')}/${pathNorm}`;
  const headers: Record<string, string> = {};

  if (!formData) {
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';
  }

  // Laravel expects this for AJAX; api.php routes do NOT use CSRF (no token needed).
  headers['X-Requested-With'] = 'XMLHttpRequest';

  const token = await getStoredToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let fetchBody: BodyInit | undefined;
  if (formData) {
    fetchBody = formData;
    delete (headers as Record<string, string>)['Content-Type'];
  } else if (body) {
    fetchBody = JSON.stringify(body);
  }

  LOG(`${method} ${path}`, { url, hasBody: !!fetchBody, hasToken: !!token });

  try {
    const res = await fetch(url, {
      method,
      headers: { ...headers, ...restHeaders },
      body: fetchBody,
    });
    const text = await res.text();
    LOG(`Response ${path}`, { status: res.status, ok: res.ok, textLength: text?.length });

    let data: T | undefined;
    if (text) {
      try {
        data = JSON.parse(text) as T;
      } catch {
        LOG(`Response ${path} parse error`, text?.slice(0, 200));
        return { error: text || res.statusText || 'Request failed', status: res.status };
      }
    }
    if (!res.ok) {
      const errMsg =
        (data as any)?.message ||
        (data as any)?.error ||
        (Array.isArray((data as any)?.errors)
          ? Object.values((data as any).errors).flat().join(', ')
          : null) ||
        text ||
        res.statusText;
      LOG(`Response ${path} error`, { status: res.status, errMsg });
      return { error: String(errMsg), status: res.status, data };
    }
    LOG(`Response ${path} success`);
    return { data: data as T, status: res.status };
  } catch (e: any) {
    LOG(`Request ${path} failed (network/catch)`, {
      url,
      message: e?.message,
      name: e?.name,
      cause: e?.cause,
      stack: e?.stack?.slice?.(0, 300),
    });
    return {
      error: e?.message || 'Network error',
      status: 0,
    };
  }
}

// --- Auth ---

export type User = { id: number; name: string; email: string; email_verified_at?: string };

export type RegisterPayload = { name: string; email: string; password: string };
export type LoginPayload = { email: string; password: string };

export type AuthResponse = { token: string; user: User };

export async function apiRegister(payload: RegisterPayload) {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export async function apiLogin(payload: LoginPayload) {
  LOG('apiLogin', { email: payload.email, hasPassword: !!payload.password });
  const result = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });
  LOG('apiLogin result', { status: result.status, hasData: !!result.data, error: result.error });
  return result;
}

export async function apiMe() {
  return request<{ user: User }>('/auth/me', { method: 'GET' });
}

export async function apiLogout() {
  const result = await request<{ message?: string }>('/auth/logout', {
    method: 'POST',
  });
  if (result.status === 200 || result.status === 204) {
    await setStoredToken(null);
  }
  return result;
}

// --- Upload / Download ---

export type UploadResponse = { download_url: string; expires_at: string };

export async function apiUpload(files: { uri: string; name: string; type?: string }[]) {
  const formData = new FormData();
  files.forEach((f, i) => {
    formData.append('files[]', {
      uri: f.uri,
      name: f.name || `file_${i}`,
      type: f.type || 'application/octet-stream',
    } as any);
  });
  return request<UploadResponse>('/upload', {
    method: 'POST',
    formData,
  });
}

/** Returns the download URL for the zip (same as upload response). Open with Linking.openURL. */
export function getDownloadUrl(filename: string): string {
  const base = API_BASE_URL.replace(/\/api\/?$/, '');
  return `${base}/api/download/${filename}`;
}
