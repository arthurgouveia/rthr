// Every key the site writes to localStorage.
export const KEYS = { theme: 'ag-theme', accent: 'ag-accent', tokens: 'ag-tokens' } as const;

export const store = {
  get(k: string): string | null {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set(k: string, v: string) {
    try {
      localStorage.setItem(k, v);
    } catch {}
  },
};
