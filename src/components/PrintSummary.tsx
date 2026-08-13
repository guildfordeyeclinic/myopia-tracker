"use client";

import type { AnalysisResult, EyeInsight } from "@/lib/al/types";

function EyeLines({ eye }: { eye: EyeInsight }) {
  const delta =
    Math.abs(eye.deltaVsP50) < 0.005
      ? "≈ P50"
      : eye.deltaVsP50 > 0
        ? `+${Math.abs(eye.deltaVsP50).toFixed(2)} mm vs P50`
        : `−${Math.abs(eye.deltaVsP50).toFixed(2)} mm vs P50`;

  return (
    <div className="print-summary-eye border border-black p-2 text-sm">
      <div className="font-bold">
        {eye.eye === "OD" ? "Right (OD)" : "Left (OS)"} — {eye.al.toFixed(2)} mm
      </div>
      <div>
        Percentile: {eye.percentileLabel}
        {eye.percentile >= 90 ? " · Recommend combo treatment" : ""}
      </div>
      <div>{delta}</div>
      <div>If untreated ≈ {eye.untreatedAlAt18.toFixed(2)} mm by age 18</div>
      {eye.alCr != null && <div>AL/CR: {eye.alCr.toFixed(3)}</div>}
      {eye.lensThicknessMm != null && (
        <div>LT: {eye.lensThicknessMm.toFixed(2)} mm</div>
      )}
      {eye.ltAl != null && <div>LT/AL: {eye.ltAl.toFixed(4)}</div>}
    </div>
  );
}

/** Shown only when printing — key numbers under the graph */
export function PrintSummary({ result }: { result: AnalysisResult }) {
  const sex = result.input.sex === "male" ? "Male" : "Female";
  return (
    <div className="print-summary hidden text-black print:block">
      <div className="print-summary-meta">
        <strong>
          {result.referenceLabel} · {sex} · age {result.ageClamped}
        </strong>
        {result.ageExtrapolatedYoung && (
          <span> · under-6 estimate (extrapolated)</span>
        )}
      </div>
      <div className="print-summary-grid">
        <EyeLines eye={result.od} />
        <EyeLines eye={result.os} />
      </div>
      <p className="print-summary-footer">
        Educational tool only · Not a diagnosis · Guildford Eye Clinic
      </p>
    </div>
  );
}
