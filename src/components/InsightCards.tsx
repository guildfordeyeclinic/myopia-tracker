"use client";

import { ltAlInterpretation } from "@/lib/al/alcr";
import type { AnalysisResult, EyeInsight } from "@/lib/al/types";

function riskTone(percentile: number): string {
  if (percentile >= 75) return "border-red-200 bg-red-50";
  if (percentile >= 50) return "border-amber-200 bg-amber-50";
  return "border-emerald-200 bg-emerald-50";
}

function EyeCard({ eye }: { eye: EyeInsight }) {
  const hasOptional =
    eye.alCr != null || eye.lensThicknessMm != null || eye.ltAl != null;

  const deltaText =
    Math.abs(eye.deltaVsP50) < 0.005
      ? "about the same as P50"
      : eye.deltaVsP50 > 0
        ? `${Math.abs(eye.deltaVsP50).toFixed(2)} mm longer than P50`
        : `${Math.abs(eye.deltaVsP50).toFixed(2)} mm shorter than P50`;

  return (
    <div className={`rounded-xl border p-4 ${riskTone(eye.percentile)}`}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          {eye.eye === "OD" ? "Right eye (OD)" : "Left eye (OS)"}
        </h3>
        <span className="text-lg font-bold tabular-nums text-slate-900">
          {eye.al.toFixed(2)} mm
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-900">
        {eye.percentileLabel}{" "}
        <span className="text-base font-semibold text-slate-600">percentile</span>
      </p>
      {eye.percentile >= 90 && (
        <p className="mt-1.5 text-sm font-semibold text-red-800">
          Recommend combo treatment
        </p>
      )}
      <p className="mt-2 text-sm text-slate-700 leading-relaxed">
        This eye is <strong>{deltaText}</strong>.
      </p>
      <div className="mt-3 rounded-lg bg-white/70 px-3 py-2 text-sm text-slate-700">
        <p className="leading-relaxed">
          If left untreated:{" "}
          <strong className="tabular-nums">
            {eye.untreatedAlAt18.toFixed(2)} mm
          </strong>{" "}
          by age 18
        </p>
      </div>

      {hasOptional && (
        <div className="mt-3 rounded-lg border border-slate-200/80 bg-white/80 px-3 py-2 text-sm text-slate-700">
          <div className="font-medium text-slate-800">Optional biometry</div>
          <ul className="mt-1.5 space-y-1">
            {eye.alCr != null && (
              <li>
                AL/CR ≈{" "}
                <strong className="tabular-nums">{eye.alCr.toFixed(3)}</strong>
                {eye.alCrFlag && (
                  <span className="text-amber-800">
                    {" "}
                    (&gt; 3.0 often discussed as elevated premyopia risk)
                  </span>
                )}
              </li>
            )}
            {eye.lensThicknessMm != null && (
              <li>
                Lens thickness (LT) ={" "}
                <strong className="tabular-nums">
                  {eye.lensThicknessMm.toFixed(2)} mm
                </strong>
              </li>
            )}
            {eye.ltAl != null && (() => {
              const interp = ltAlInterpretation(eye.ltAl);
              const toneClass =
                interp.tone === "green"
                  ? "bg-emerald-100 text-emerald-900"
                  : interp.tone === "amber"
                    ? "bg-amber-100 text-amber-950"
                    : interp.tone === "orange"
                      ? "bg-orange-100 text-orange-950"
                      : interp.tone === "red"
                        ? "bg-red-100 text-red-900"
                        : "bg-slate-100 text-slate-800";
              return (
                <li className="list-none -mx-1 mt-1">
                  <div className={`rounded-md px-2 py-1.5 ${toneClass}`}>
                    <div>
                      LT/AL ≈{" "}
                      <strong className="tabular-nums">
                        {eye.ltAl.toFixed(4)}
                      </strong>
                      <span className="opacity-80">
                        {" "}
                        ({(eye.ltAl * 100).toFixed(2)}% of AL)
                      </span>
                    </div>
                    <div className="mt-0.5 font-semibold">{interp.label}</div>
                    <div className="text-xs leading-relaxed opacity-95">
                      {interp.detail}
                    </div>
                  </div>
                </li>
              );
            })()}
          </ul>
        </div>
      )}
    </div>
  );
}

export function InsightCards({ result }: { result: AnalysisResult }) {
  return (
    <div className="space-y-4">
      {result.ageExtrapolatedYoung && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Age under 6: percentile is an <strong>estimate</strong> from linear
          extrapolation of the published charts (which start at age 6). Use with
          caution — not as accurate as in-range values.
        </div>
      )}
      {result.ageOutOfRange && !result.ageExtrapolatedYoung && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Age is outside the main published reference range (6–18). Values are
          estimated (age used: {result.ageClamped}).
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <EyeCard eye={result.od} />
        <EyeCard eye={result.os} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 leading-relaxed">
        <h3 className="font-semibold text-slate-900">Growth context</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            Typical <strong>physiologic / emmetropic-peer</strong> elongation at
            this age is about{" "}
            <strong className="tabular-nums">
              {result.physiologicRateMmPerYear.toFixed(2)} mm/year
            </strong>{" "}
            (literature ranges; treatment success is often framed as slowing
            toward this rate).
          </li>
          <li>
            Typical <strong>untreated progressive myopia</strong> elongation at
            this age is about{" "}
            <strong className="tabular-nums">
              {result.untreatedRateMmPerYear.toFixed(2)} mm/year
            </strong>{" "}
            in published summaries.
          </li>
          <li>
            On growth charts, ≥ <strong>50th</strong> percentile is associated
            with higher myopia risk; ≥ <strong>75th</strong> with higher risk of
            high myopia (Tideman / clinical reviews). Goal often cited: keep AL
            under <strong>26 mm</strong>.
          </li>
          <li>
            <strong>LT/AL buffering:</strong> &gt; 0.14 still some buffering
            left; 0.13–0.135 buffer running low; &lt; 0.126 buffering completely
            gone.
          </li>
        </ul>
      </div>
    </div>
  );
}
