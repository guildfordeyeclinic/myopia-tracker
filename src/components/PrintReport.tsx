"use client";

import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { HIGH_MYOPIA_AL_MM } from "@/lib/al/project";
import {
  Y_MAX,
  Y_MIN,
  buildPercentileSeries,
  clampPlot,
  toPlot,
} from "@/lib/al/chartSeries";
import type { AnalysisResult, EyeInsight } from "@/lib/al/types";

const PRINT_SOURCE_ID = "al-print-chart-source";
const CHART_W = 720;
const CHART_H = 400;

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function eyeHtml(eye: EyeInsight) {
  const title =
    eye.eye === "OD"
      ? `Right (OD) — ${eye.al.toFixed(2)} mm`
      : `Left (OS) — ${eye.al.toFixed(2)} mm`;
  const delta =
    Math.abs(eye.deltaVsP50) < 0.005
      ? "≈ P50"
      : eye.deltaVsP50 > 0
        ? `+${Math.abs(eye.deltaVsP50).toFixed(2)} mm vs P50`
        : `−${Math.abs(eye.deltaVsP50).toFixed(2)} mm vs P50`;
  const combo =
    eye.percentile >= 90 ? " · Recommend combo treatment" : "";
  const extra = [
    eye.alCr != null ? `AL/CR: ${eye.alCr.toFixed(3)}` : "",
    eye.lensThicknessMm != null
      ? `LT: ${eye.lensThicknessMm.toFixed(2)} mm`
      : "",
    eye.ltAl != null ? `LT/AL: ${eye.ltAl.toFixed(4)}` : "",
  ]
    .filter(Boolean)
    .map((line) => `<div>${esc(line)}</div>`)
    .join("");

  return `
    <div class="eye">
      <div class="eye-title">${esc(title)}</div>
      <div>Percentile: ${esc(eye.percentileLabel)}${esc(combo)}</div>
      <div>${esc(delta)}</div>
      <div>If untreated ≈ ${esc(eye.untreatedAlAt18.toFixed(2))} mm by age 18</div>
      ${extra}
    </div>
  `;
}

function serializeChartSvg(): string | null {
  const host = document.getElementById(PRINT_SOURCE_ID);
  const svg = host?.querySelector("svg");
  if (!svg) return null;

  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const w = clone.getAttribute("width") || String(CHART_W);
  const h = clone.getAttribute("height") || String(CHART_H);
  if (!clone.getAttribute("viewBox")) {
    clone.setAttribute("viewBox", `0 0 ${w} ${h}`);
  }
  clone.setAttribute("width", "100%");
  clone.setAttribute("height", "auto");
  clone.setAttribute("preserveAspectRatio", "xMidYMid meet");
  clone.style.width = "100%";
  clone.style.height = "auto";
  clone.style.display = "block";

  return new XMLSerializer().serializeToString(clone);
}

function buildPrintDocument(result: AnalysisResult, svgMarkup: string) {
  const sex = result.input.sex === "male" ? "Male" : "Female";
  const young = result.ageExtrapolatedYoung
    ? " · under-6 estimate (extrapolated)"
    : "";
  const meta = `${result.referenceLabel} · ${sex} · age ${result.ageClamped}${young}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Axial length percentile graph</title>
  <style>
    @page {
      size: letter portrait;
      margin: 0.75in;
    }
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: #fff;
      color: #000;
      font-family: Arial, Helvetica, sans-serif;
    }
    .sheet { width: 100%; }
    h1 {
      font-size: 16pt;
      font-weight: 700;
      margin: 0 0 3pt 0;
      line-height: 1.2;
    }
    .meta {
      font-size: 10pt;
      margin: 0 0 8pt 0;
      line-height: 1.3;
    }
    .legend {
      font-size: 8.5pt;
      line-height: 1.35;
      border-bottom: 1px solid #000;
      padding: 0 0 6pt 0;
      margin: 0 0 8pt 0;
    }
    .chart {
      width: 100%;
      margin: 0 0 10pt 0;
    }
    .chart svg {
      width: 100% !important;
      height: auto !important;
      display: block;
    }
    .eyes {
      display: table;
      width: 100%;
      border-collapse: separate;
      border-spacing: 10pt 0;
      margin: 0 -5pt;
    }
    .eye {
      display: table-cell;
      width: 50%;
      border: 1px solid #000;
      padding: 8pt 10pt;
      font-size: 10pt;
      line-height: 1.4;
      vertical-align: top;
    }
    .eye-title {
      font-weight: 700;
      font-size: 11pt;
      margin-bottom: 2pt;
    }
    .footer {
      margin: 10pt 0 0 0;
      font-size: 8.5pt;
      color: #333;
    }
  </style>
</head>
<body>
  <div class="sheet">
    <h1>Axial length percentile graph</h1>
    <p class="meta">${esc(meta)}</p>
    <div class="legend">
      <strong>P5</strong> solid &nbsp;
      <strong>P25</strong> dash &nbsp;
      <strong>P50</strong> thick solid &nbsp;
      <strong>P75</strong> dash &nbsp;
      <strong>P90</strong> solid &nbsp;
      <strong>P95</strong> solid &nbsp;
      <strong>26 mm</strong> long-dash &nbsp;
      <strong>●</strong> OD / OS measured points
    </div>
    <div class="chart">${svgMarkup}</div>
    <div class="eyes">
      ${eyeHtml(result.od)}
      ${eyeHtml(result.os)}
    </div>
    <p class="footer">Educational tool only · Not a diagnosis · Guildford Eye Clinic</p>
  </div>
</body>
</html>`;
}

const PRINT_FRAME_ID = "al-print-frame";

function writePrintFrame(html: string) {
  let frame = document.getElementById(PRINT_FRAME_ID) as HTMLIFrameElement | null;
  if (!frame) {
    frame = document.createElement("iframe");
    frame.id = PRINT_FRAME_ID;
    frame.setAttribute("aria-hidden", "true");
    frame.setAttribute("title", "Print graph");
    frame.style.position = "fixed";
    frame.style.left = "-10000px";
    frame.style.top = "0";
    frame.style.width = "8.5in";
    frame.style.height = "11in";
    frame.style.border = "0";
    frame.style.visibility = "hidden";
    document.body.appendChild(frame);
  }

  const doc = frame.contentDocument;
  const win = frame.contentWindow;
  if (!doc || !win) {
    window.alert("Could not open the print view. Try again.");
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  const run = () => {
    win.focus();
    win.print();
  };

  if (doc.readyState === "complete") {
    window.setTimeout(run, 250);
  } else {
    frame.onload = () => window.setTimeout(run, 250);
  }
}

/** Print a standalone letter-page report (does not use the site’s print CSS). */
export function printGraph(result: AnalysisResult) {
  const first = serializeChartSvg();
  if (first) {
    writePrintFrame(buildPrintDocument(result, first));
    return;
  }
  window.setTimeout(() => {
    const again = serializeChartSvg();
    if (!again) {
      window.alert("The graph is still drawing. Click Print graph again.");
      return;
    }
    writePrintFrame(buildPrintDocument(result, again));
  }, 150);
}

function BwChart({ result }: { result: AnalysisResult }) {
  const { data, yTicks, xTicks, chartAgeMin, chartAgeMax } =
    buildPercentileSeries(
      result.input.ethnicity,
      result.input.sex,
      result.ageClamped
    );
  const age = result.ageClamped;
  const untreatedOd = result.od.untreatedAlAt18;
  const untreatedOs = result.os.untreatedAlAt18;

  return (
    <ComposedChart
      width={CHART_W}
      height={CHART_H}
      data={data}
      margin={{ top: 18, right: 72, left: 46, bottom: 38 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#999" />
      <XAxis
        dataKey="age"
        type="number"
        domain={[chartAgeMin, chartAgeMax]}
        ticks={xTicks}
        tick={{ fill: "#000", fontSize: 11 }}
        tickMargin={6}
        label={{
          value: "Age (years)",
          position: "insideBottom",
          offset: -24,
          fill: "#000",
        }}
      />
      <YAxis
        domain={[0, Y_MAX - Y_MIN]}
        ticks={yTicks}
        tickFormatter={(v: number) => String(v + Y_MIN)}
        tick={{ fill: "#000", fontSize: 11 }}
        tickMargin={4}
        width={44}
        label={{
          value: "Axial length (mm)",
          angle: -90,
          position: "insideLeft",
          offset: 6,
          style: { textAnchor: "middle", fill: "#000" },
        }}
      />
      <Line
        type="monotone"
        dataKey="p5"
        stroke="#000"
        strokeWidth={1.2}
        dot={false}
        isAnimationActive={false}
        legendType="none"
      />
      <Line
        type="monotone"
        dataKey="p25"
        stroke="#000"
        strokeWidth={1.2}
        strokeDasharray="5 3"
        dot={false}
        isAnimationActive={false}
        legendType="none"
      />
      <Line
        type="monotone"
        dataKey="p50"
        stroke="#000"
        strokeWidth={2.4}
        dot={false}
        isAnimationActive={false}
        legendType="none"
      />
      <Line
        type="monotone"
        dataKey="p75"
        stroke="#000"
        strokeWidth={1.2}
        strokeDasharray="5 3"
        dot={false}
        isAnimationActive={false}
        legendType="none"
      />
      <Line
        type="monotone"
        dataKey="p90"
        stroke="#000"
        strokeWidth={1.4}
        dot={false}
        isAnimationActive={false}
        legendType="none"
      />
      <Line
        type="monotone"
        dataKey="p95"
        stroke="#000"
        strokeWidth={1.6}
        dot={false}
        isAnimationActive={false}
        legendType="none"
      />
      <ReferenceLine
        y={toPlot(HIGH_MYOPIA_AL_MM)}
        stroke="#000"
        strokeDasharray="8 4"
        strokeWidth={1.3}
        label={{
          value: "26 mm",
          position: "insideTopLeft",
          fill: "#000",
          fontSize: 11,
          fontWeight: 700,
        }}
      />
      <ReferenceDot
        x={age}
        y={clampPlot(result.input.alOd)}
        r={6}
        fill="#000"
        stroke="#000"
        label={{
          value: "OD",
          position: "top",
          fill: "#000",
          fontSize: 11,
          fontWeight: 700,
        }}
      />
      <ReferenceDot
        x={age}
        y={clampPlot(result.input.alOs)}
        r={6}
        fill="#000"
        stroke="#000"
        label={{
          value: "OS",
          position: "bottom",
          fill: "#000",
          fontSize: 11,
          fontWeight: 700,
        }}
      />
      {untreatedOd >= Y_MIN && untreatedOd <= Y_MAX + 0.5 && (
        <ReferenceDot
          x={18}
          y={clampPlot(untreatedOd)}
          r={4}
          fill="#000"
          stroke="#000"
          label={{
            value: "OD@18",
            position: "left",
            fill: "#000",
            fontSize: 10,
            fontWeight: 700,
          }}
        />
      )}
      {untreatedOs >= Y_MIN && untreatedOs <= Y_MAX + 0.5 && (
        <ReferenceDot
          x={18}
          y={clampPlot(untreatedOs)}
          r={4}
          fill="#000"
          stroke="#000"
          label={{
            value: "OS@18",
            position: "left",
            fill: "#000",
            fontSize: 10,
            fontWeight: 700,
          }}
        />
      )}
    </ComposedChart>
  );
}

/** Off-screen fixed-size B&W chart used only as the print SVG source. */
export function PrintReport({ result }: { result: AnalysisResult }) {
  return (
    <div
      id={PRINT_SOURCE_ID}
      className="pointer-events-none fixed left-0 top-0 z-[-1] h-[400px] w-[720px] opacity-0"
      aria-hidden
    >
      <BwChart result={result} />
    </div>
  );
}
