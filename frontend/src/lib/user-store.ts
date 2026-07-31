/**
 * Simple client-side user store using localStorage.
 * Persists user data from signup/login across the session.
 */

export interface UserData {
  name: string;
  email: string;
}

const STORAGE_KEY = "hawkeye_user";

/** Get the stored user, or return null if not logged in */
export function getUser(): UserData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserData;
  } catch {
    return null;
  }
}

/** Save user data to localStorage */
export function saveUser(user: UserData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

/** Clear user data (sign out) */
export function clearUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/** Get display initials from a name */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
