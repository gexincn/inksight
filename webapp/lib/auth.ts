const TOKEN_KEY = "ink_token";
const AUTH_EVENT = "ink_auth_changed";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function authHeaders(extra?: Record<string, string>): Record<string, string> {
  const h: Record<string, string> = { ...extra };
  const t = getToken();
  if (t) h["Authorization"] = `Bearer ${t}`;
  return h;
}

export function onAuthChanged(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handleCustom = () => callback();
  const handleStorage = (event: StorageEvent) => {
    if (event.key === TOKEN_KEY) callback();
  };
  window.addEventListener(AUTH_EVENT, handleCustom);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(AUTH_EVENT, handleCustom);
    window.removeEventListener("storage", handleStorage);
  };
}
