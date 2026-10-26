// Accept only public http(s) URLs. Blocks localhost / private ranges / credentials.
export function safeUrl(input: string): string | null {
  try {
    const u = new URL(input.trim());
    if (!["http:", "https:"].includes(u.protocol) || u.username || u.password) return null;
    const h = u.hostname.toLowerCase();
    if (h === "localhost" || h.endsWith(".local") || !h.includes(".")) return null;
    if (/^(10\.|127\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(h)) return null;
    u.hash = "";
    return u.toString();
  } catch { return null; }
}
