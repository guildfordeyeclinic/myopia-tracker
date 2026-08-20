"use client";

import { averageK } from "@/lib/al/keratometry";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20";

export function KeratometryInputs({
  steep,
  flat,
  mean,
  unit,
  onChange,
}: {
  steep: string;
  flat: string;
  mean: string;
  unit: "mm" | "D";
  onChange: (next: { steep: string; flat: string; mean: string }) => void;
}) {
  const placeholder = unit === "mm" ? "mm" : "D";
  const steepLabel = unit === "mm" ? "Steep r" : "Steep K";
  const flatLabel = unit === "mm" ? "Flat r" : "Flat K";
  const meanLabel = unit === "mm" ? "Mean r" : "Mean K";

  const setSteep = (v: string) => {
    const avg = averageK(v, flat);
    onChange({ steep: v, flat, mean: avg ?? mean });
  };
  const setFlat = (v: string) => {
    const avg = averageK(steep, v);
    onChange({ steep, flat: v, mean: avg ?? mean });
  };
  const setMean = (v: string) => {
    onChange({ steep, flat, mean: v });
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      <div>
        <label className="mb-0.5 block text-xs text-slate-600">
          {steepLabel} ({unit})
        </label>
        <input
          type="number"
          step={0.01}
          value={steep}
          onChange={(e) => setSteep(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-0.5 block text-xs text-slate-600">
          {flatLabel} ({unit})
        </label>
        <input
          type="number"
          step={0.01}
          value={flat}
          onChange={(e) => setFlat(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-0.5 block text-xs font-medium text-slate-700">
          {meanLabel} ({unit})
        </label>
        <input
          type="number"
          step={0.01}
          value={mean}
          onChange={(e) => setMean(e.target.value)}
          placeholder={unit === "mm" ? "e.g. 7.80" : "e.g. 43.25"}
          className={`${inputClass} bg-white font-medium`}
        />
      </div>
    </div>
  );
}
