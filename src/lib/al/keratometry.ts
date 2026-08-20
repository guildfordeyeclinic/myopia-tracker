/** Mean of steep and flat meridians, or null if either is missing/invalid. */
export function averageK(steep: string, flat: string): string | null {
  const s = String(steep ?? "").trim();
  const f = String(flat ?? "").trim();
  if (s === "" || f === "") return null;
  const a = Number(s);
  const b = Number(f);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return ((a + b) / 2).toFixed(2);
}
