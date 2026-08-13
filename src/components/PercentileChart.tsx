"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Y_MAX,
  Y_MIN,
  buildPercentileSeries,
  clampPlot,
  toPlot,
} from "@/lib/al/chartSeries";
import { HIGH_MYOPIA_AL_MM } from "@/lib/al/project";
import type { Ethnicity, Sex } from "@/lib/al/types";

interface Props {
  age: number;
  sex: Sex;
  ethnicity: Ethnicity;
  alOd: number;
  alOs: number;
  untreatedOd?: number;
  untreatedOs?: number;
}

/** Vibrant percentile bands (cool → warm) */
const BAND_COLORS = {
  below5: "#4ade80",
  p5_25: "#86efac",
  p25_50: "#bef264",
  p50_75: "#facc15",
  p75_90: "#fb923c",
  p90_95: "#f87171",
  above95: "#ef4444",
};

const BAND_OPACITY = 0.72;

/** Legend items in correct percentile order with distinct shapes */
const LEGEND_ITEMS: {
  key: string;
  label: string;
  color: string;
  shape: "triangle" | "square" | "circle" | "diamond" | "triangleDown" | "cross";
}[] = [
  { key: "p5", label: "P5", color: "#15803d", shape: "triangle" },
  { key: "p25", label: "P25", color: "#65a30d", shape: "square" },
  { key: "p50", label: "P50", color: "#0f172a", shape: "circle" },
  { key: "p75", label: "P75", color: "#ca8a04", shape: "diamond" },
  { key: "p90", label: "P90", color: "#ea580c", shape: "triangleDown" },
  { key: "p95", label: "P95", color: "#dc2626", shape: "cross" },
];

function LegendShape({
  shape,
  color,
}: {
  shape: (typeof LEGEND_ITEMS)[number]["shape"];
  color: string;
}) {
  const s = 12;
  const mid = s / 2;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden>
      {shape === "triangle" && (
        <polygon points={`${mid},1 ${s - 1},${s - 1} 1,${s - 1}`} fill={color} />
      )}
      {shape === "square" && (
        <rect x={2} y={2} width={s - 4} height={s - 4} fill={color} rx={1} />
      )}
      {shape === "circle" && (
        <circle cx={mid} cy={mid} r={4.5} fill={color} />
      )}
      {shape === "diamond" && (
        <polygon
          points={`${mid},1 ${s - 1},${mid} ${mid},${s - 1} 1,${mid}`}
          fill={color}
        />
      )}
      {shape === "triangleDown" && (
        <polygon points={`1,1 ${s - 1},1 ${mid},${s - 1}`} fill={color} />
      )}
      {shape === "cross" && (
        <g stroke={color} strokeWidth={2.2} strokeLinecap="round">
          <line x1={2.5} y1={2.5} x2={s - 2.5} y2={s - 2.5} />
          <line x1={s - 2.5} y1={2.5} x2={2.5} y2={s - 2.5} />
        </g>
      )}
    </svg>
  );
}

/** Markers only when hovering a data point (activeDot) */
function makeActiveDot(
  shape: (typeof LEGEND_ITEMS)[number]["shape"],
  color: string
) {
  return function PercentileActiveDot(props: {
    cx?: number;
    cy?: number;
  }) {
    const { cx = 0, cy = 0 } = props;
    const r = 5;
    if (shape === "circle") {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={color}
          stroke="#fff"
          strokeWidth={1.5}
        />
      );
    }
    if (shape === "square") {
      return (
        <rect
          x={cx - r}
          y={cy - r}
          width={r * 2}
          height={r * 2}
          fill={color}
          stroke="#fff"
          strokeWidth={1.5}
          rx={1}
        />
      );
    }
    if (shape === "triangle") {
      return (
        <polygon
          points={`${cx},${cy - r - 1} ${cx + r},${cy + r} ${cx - r},${cy + r}`}
          fill={color}
          stroke="#fff"
          strokeWidth={1.5}
        />
      );
    }
    if (shape === "diamond") {
      return (
        <polygon
          points={`${cx},${cy - r - 1} ${cx + r},${cy} ${cx},${cy + r + 1} ${cx - r},${cy}`}
          fill={color}
          stroke="#fff"
          strokeWidth={1.5}
        />
      );
    }
    if (shape === "triangleDown") {
      return (
        <polygon
          points={`${cx - r},${cy - r} ${cx + r},${cy - r} ${cx},${cy + r + 1}`}
          fill={color}
          stroke="#fff"
          strokeWidth={1.5}
        />
      );
    }
    // cross
    return (
      <g stroke={color} strokeWidth={2.2} strokeLinecap="round">
        <line x1={cx - r} y1={cy - r} x2={cx + r} y2={cy + r} />
        <line x1={cx + r} y1={cy - r} x2={cx - r} y2={cy + r} />
      </g>
    );
  };
}

export function PercentileChart({
  age,
  sex,
  ethnicity,
  alOd,
  alOs,
  untreatedOd,
  untreatedOs,
}: Props) {
  const { data, yTicks, xTicks, chartAgeMin, chartAgeMax } =
    buildPercentileSeries(ethnicity, sex, age);

  return (
    <div className="w-full">
      <div className="mb-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 px-1">
        {LEGEND_ITEMS.map((item) => (
          <span
            key={item.key}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700"
          >
            <LegendShape shape={item.shape} color={item.color} />
            {item.label}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-700" />
          OD
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-violet-700" />
          OS
        </span>
      </div>

      <div className="h-[420px] sm:h-[480px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 16, right: 56, left: 12, bottom: 28 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
            <XAxis
              dataKey="age"
              type="number"
              domain={[chartAgeMin, chartAgeMax]}
              ticks={xTicks}
              tick={{ fill: "#475569", fontSize: 12 }}
              tickMargin={6}
              label={{
                value: "Age (years)",
                position: "insideBottom",
                offset: -16,
                fill: "#64748b",
              }}
            />
            <YAxis
              domain={[0, Y_MAX - Y_MIN]}
              ticks={yTicks}
              tickFormatter={(v: number) => String(v + Y_MIN)}
              tick={{ fill: "#475569", fontSize: 12 }}
              label={{
                value: "Axial length (mm)",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: "#64748b" },
              }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const row = payload[0]?.payload as (typeof data)[0] | undefined;
                if (!row) return null;
                return (
                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
                    <div className="font-semibold text-slate-800">Age {label}</div>
                    <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 text-slate-600">
                      <span>P5</span>
                      <span>{row.rawP5.toFixed(2)} mm</span>
                      <span>P25</span>
                      <span>{row.rawP25.toFixed(2)} mm</span>
                      <span className="font-medium">P50</span>
                      <span className="font-medium">{row.rawP50.toFixed(2)} mm</span>
                      <span>P75</span>
                      <span>{row.rawP75.toFixed(2)} mm</span>
                      <span>P90</span>
                      <span>{row.rawP90.toFixed(2)} mm</span>
                      <span>P95</span>
                      <span>{row.rawP95.toFixed(2)} mm</span>
                    </div>
                  </div>
                );
              }}
            />

            <Area type="monotone" dataKey="band0" stackId="bands" stroke="none" fill={BAND_COLORS.below5} fillOpacity={BAND_OPACITY} isAnimationActive={false} legendType="none" />
            <Area type="monotone" dataKey="band1" stackId="bands" stroke="none" fill={BAND_COLORS.p5_25} fillOpacity={BAND_OPACITY} isAnimationActive={false} legendType="none" />
            <Area type="monotone" dataKey="band2" stackId="bands" stroke="none" fill={BAND_COLORS.p25_50} fillOpacity={0.78} isAnimationActive={false} legendType="none" />
            <Area type="monotone" dataKey="band3" stackId="bands" stroke="none" fill={BAND_COLORS.p50_75} fillOpacity={0.8} isAnimationActive={false} legendType="none" />
            <Area type="monotone" dataKey="band4" stackId="bands" stroke="none" fill={BAND_COLORS.p75_90} fillOpacity={0.82} isAnimationActive={false} legendType="none" />
            <Area type="monotone" dataKey="band5" stackId="bands" stroke="none" fill={BAND_COLORS.p90_95} fillOpacity={0.85} isAnimationActive={false} legendType="none" />
            <Area type="monotone" dataKey="band6" stackId="bands" stroke="none" fill={BAND_COLORS.above95} fillOpacity={0.55} isAnimationActive={false} legendType="none" />

            <Line
              type="monotone"
              dataKey="p5"
              stroke="#15803d"
              strokeWidth={2}
              dot={false}
              activeDot={makeActiveDot("triangle", "#15803d")}
              isAnimationActive={false}
              legendType="none"
            />
            <Line
              type="monotone"
              dataKey="p25"
              stroke="#65a30d"
              strokeWidth={1.75}
              strokeDasharray="5 3"
              dot={false}
              activeDot={makeActiveDot("square", "#65a30d")}
              isAnimationActive={false}
              legendType="none"
            />
            <Line
              type="monotone"
              dataKey="p50"
              stroke="#0f172a"
              strokeWidth={3}
              dot={false}
              activeDot={makeActiveDot("circle", "#0f172a")}
              isAnimationActive={false}
              legendType="none"
            />
            <Line
              type="monotone"
              dataKey="p75"
              stroke="#ca8a04"
              strokeWidth={1.75}
              strokeDasharray="5 3"
              dot={false}
              activeDot={makeActiveDot("diamond", "#ca8a04")}
              isAnimationActive={false}
              legendType="none"
            />
            <Line
              type="monotone"
              dataKey="p90"
              stroke="#ea580c"
              strokeWidth={2}
              dot={false}
              activeDot={makeActiveDot("triangleDown", "#ea580c")}
              isAnimationActive={false}
              legendType="none"
            />
            <Line
              type="monotone"
              dataKey="p95"
              stroke="#dc2626"
              strokeWidth={2.25}
              dot={false}
              activeDot={makeActiveDot("cross", "#dc2626")}
              isAnimationActive={false}
              legendType="none"
            />

            <ReferenceLine
              y={toPlot(HIGH_MYOPIA_AL_MM)}
              stroke="#b91c1c"
              strokeDasharray="6 4"
              strokeWidth={2}
              label={{
                value: "26 mm",
                position: "insideTopLeft",
                fill: "#b91c1c",
                fontSize: 12,
                fontWeight: 700,
              }}
            />

            <ReferenceDot
              x={age}
              y={clampPlot(alOd)}
              r={8}
              fill="#1d4ed8"
              stroke="#fff"
              strokeWidth={2}
              label={{
                value: "OD",
                position: "top",
                fill: "#1d4ed8",
                fontSize: 12,
                fontWeight: 700,
              }}
            />
            <ReferenceDot
              x={age}
              y={clampPlot(alOs)}
              r={8}
              fill="#7c3aed"
              stroke="#fff"
              strokeWidth={2}
              label={{
                value: "OS",
                position: "bottom",
                fill: "#7c3aed",
                fontSize: 12,
                fontWeight: 700,
              }}
            />

            {untreatedOd != null &&
              untreatedOd >= Y_MIN &&
              untreatedOd <= Y_MAX + 0.5 && (
                <ReferenceDot
                  x={18}
                  y={clampPlot(untreatedOd)}
                  r={5}
                  fill="#dbeafe"
                  stroke="#2563eb"
                  strokeWidth={2}
                  label={{
                    value: "OD@18",
                    position: "left",
                    fill: "#1e40af",
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
              )}
            {untreatedOs != null &&
              untreatedOs >= Y_MIN &&
              untreatedOs <= Y_MAX + 0.5 && (
                <ReferenceDot
                  x={18}
                  y={clampPlot(untreatedOs)}
                  r={5}
                  fill="#ede9fe"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  label={{
                    value: "OS@18",
                    position: "left",
                    fill: "#5b21b6",
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
              )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
        <span className="font-medium text-slate-700">Bands:</span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-2.5 w-3 rounded-sm bg-green-400" />
          low
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-2.5 w-3 rounded-sm bg-yellow-400" />
          mid
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-2.5 w-3 rounded-sm bg-orange-400" />
          high
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-2.5 w-3 rounded-sm bg-red-500" />
          very high
        </span>
      </div>
    </div>
  );
}
