"use client";

import { KeratometryInputs } from "@/components/KeratometryInputs";
import type { Ethnicity, Sex } from "@/lib/al/types";

export interface FormValues {
  age: string;
  sex: Sex;
  ethnicity: Ethnicity;
  alOd: string;
  alOs: string;
  crMode: "radius" | "k";
  cornealOd: string;
  cornealOs: string;
  cornealSteepOd: string;
  cornealFlatOd: string;
  cornealSteepOs: string;
  cornealFlatOs: string;
  ltOd: string;
  ltOs: string;
}

interface Props {
  values: FormValues;
  onChange: (next: FormValues) => void;
  onSubmit: () => void;
  onDemo: () => void;
  onClear: () => void;
}

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20";

export function MeasurementForm({
  values,
  onChange,
  onSubmit,
  onDemo,
  onClear,
}: Props) {
  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    onChange({ ...values, [key]: value });

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Age at measurement (years)
        </label>
        <input
          type="number"
          min={3}
          max={18}
          step={0.1}
          required
          value={values.age}
          onChange={(e) => set("age", e.target.value)}
          placeholder="e.g. 9.5"
          className={`${inputClass} py-2.5`}
        />
        <p className="mt-1 text-xs text-slate-500">
          Ages 6–18 use published charts; under 6 is estimated by extrapolation
        </p>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-slate-700 mb-2">Sex</legend>
        <div className="flex gap-4">
          {(
            [
              ["male", "Male"],
              ["female", "Female"],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sex"
                checked={values.sex === value}
                onChange={() => set("sex", value)}
                className="h-4 w-4 text-teal-700 focus:ring-teal-600"
              />
              <span className="text-sm text-slate-800">{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-slate-700 mb-2">
          Ethnicity reference chart
        </legend>
        <div className="space-y-2">
          {(
            [
              ["european", "Default"],
              ["east_asian", "East Asian (Chinese-reference)"],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition ${
                values.ethnicity === value
                  ? "border-teal-600 bg-teal-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="ethnicity"
                checked={values.ethnicity === value}
                onChange={() => set("ethnicity", value)}
                className="h-4 w-4 text-teal-700 focus:ring-teal-600"
              />
              <span className="text-sm font-medium text-slate-900">
                {label}
              </span>
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Default is for all non–East Asian ethnicities (Tideman European
          reference).
        </p>
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Right eye AL (OD)
          </label>
          <div className="relative">
            <input
              type="number"
              min={18}
              max={32}
              step={0.01}
              required
              value={values.alOd}
              onChange={(e) => set("alOd", e.target.value)}
              placeholder="mm"
              className={`${inputClass} py-2.5 pr-10`}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              mm
            </span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Left eye AL (OS)
          </label>
          <div className="relative">
            <input
              type="number"
              min={18}
              max={32}
              step={0.01}
              required
              value={values.alOs}
              onChange={(e) => set("alOs", e.target.value)}
              placeholder="mm"
              className={`${inputClass} py-2.5 pr-10`}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              mm
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/80 p-3 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-slate-700">
            Optional biometry
          </p>
          <select
            value={values.crMode}
            onChange={(e) =>
              set("crMode", e.target.value as "radius" | "k")
            }
            className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
          >
            <option value="radius">Cornea as radius (mm)</option>
            <option value="k">Cornea as mean K (D)</option>
          </select>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
            Corneal curvature
          </p>
          <p className="mb-2 text-xs text-slate-500">
            Enter steep and flat to auto-fill mean, or type mean K only.
          </p>
          <div className="space-y-3">
            <div>
              <p className="mb-1 text-xs font-medium text-slate-600">OD</p>
              <KeratometryInputs
                steep={values.cornealSteepOd}
                flat={values.cornealFlatOd}
                mean={values.cornealOd}
                unit={values.crMode === "radius" ? "mm" : "D"}
                onChange={({ steep, flat, mean }) =>
                  onChange({
                    ...values,
                    cornealSteepOd: steep,
                    cornealFlatOd: flat,
                    cornealOd: mean,
                  })
                }
              />
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-slate-600">OS</p>
              <KeratometryInputs
                steep={values.cornealSteepOs}
                flat={values.cornealFlatOs}
                mean={values.cornealOs}
                unit={values.crMode === "radius" ? "mm" : "D"}
                onChange={({ steep, flat, mean }) =>
                  onChange({
                    ...values,
                    cornealSteepOs: steep,
                    cornealFlatOs: flat,
                    cornealOs: mean,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
            Lens thickness (LT)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-slate-600 mb-0.5">OD (mm)</label>
              <input
                type="number"
                step={0.01}
                min={2}
                max={6}
                value={values.ltOd}
                onChange={(e) => set("ltOd", e.target.value)}
                placeholder="mm"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-0.5">OS (mm)</label>
              <input
                type="number"
                step={0.01}
                min={2}
                max={6}
                value={values.ltOs}
                onChange={(e) => set("ltOs", e.target.value)}
                placeholder="mm"
                className={inputClass}
              />
            </div>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            Enables AL/CR and LT/AL ratios in results when filled.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
        >
          Show on graph
        </button>
        <button
          type="button"
          onClick={onDemo}
          className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Try demo values
        </button>
        <button
          type="button"
          onClick={onClear}
          className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-800"
        >
          Clear data
        </button>
      </div>
    </form>
  );
}
