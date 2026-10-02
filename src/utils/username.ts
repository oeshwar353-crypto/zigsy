const TAKEN_USERNAMES_KEY = "zigsy_taken_usernames";
const DEFAULT_TAKEN_USERNAMES = ["sarah", "sierra", "marcus", "chloe", "jordan"];

export function getTakenUsernames(): string[] {
  const stored = localStorage.getItem(TAKEN_USERNAMES_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
  }
  return DEFAULT_TAKEN_USERNAMES;
}

export function isUsernameTaken(username: string, currentUsername?: string): boolean {
  const normalized = username.trim().toLowerCase();
  if (currentUsername && normalized === currentUsername.trim().toLowerCase()) {
    return false; // Not taken if it's their own current username
  }
  return getTakenUsernames().includes(normalized);
}

export function addTakenUsername(username: string) {
  const list = getTakenUsernames();
  const normalized = username.trim().toLowerCase();
  if (!list.includes(normalized)) {
    list.push(normalized);
    localStorage.setItem(TAKEN_USERNAMES_KEY, JSON.stringify(list));
  }
}
