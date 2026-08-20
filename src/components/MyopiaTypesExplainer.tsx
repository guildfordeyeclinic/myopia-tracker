function EyeSvg({
  variant,
}: {
  variant: "normal" | "refractive" | "axial";
}) {
  const steep = variant === "refractive";
  const long = variant === "axial";
  const globeRx = long ? 78 : 64;
  const globeCx = long ? 148 : 138;
  const retinaX = globeCx + globeRx - 2;
  const focusX =
    variant === "normal" ? retinaX : variant === "refractive" ? 132 : 150;

  return (
    <svg
      viewBox="0 0 280 160"
      className="mx-auto h-40 w-full max-w-sm"
      aria-hidden
    >
      {/* incoming rays */}
      <line x1="8" y1="58" x2="78" y2="58" stroke="#e86a2d" strokeWidth="2" />
      <line x1="8" y1="102" x2="78" y2="102" stroke="#e86a2d" strokeWidth="2" />
      <line
        x1="8"
        y1="80"
        x2={retinaX + 18}
        y2="80"
        stroke="#c5cdd6"
        strokeWidth="1"
        strokeDasharray="3 4"
      />

      {/* globe */}
      <ellipse
        cx={globeCx}
        cy="80"
        rx={globeRx}
        ry="64"
        fill="#d7dde4"
        stroke={long ? "#c0392b" : "#1f2a44"}
        strokeWidth={long ? 3 : 2.4}
      />
      {long && (
        <ellipse
          cx="132"
          cy="80"
          rx="58"
          ry="62"
          fill="none"
          stroke="#1f2a44"
          strokeWidth="1.4"
          opacity="0.45"
        />
      )}

      {/* cornea */}
      <path
        d={
          steep
            ? "M86 48 C62 62, 62 98, 86 112"
            : "M88 50 C70 64, 70 96, 88 110"
        }
        fill="#eef2f5"
        stroke={steep ? "#c0392b" : "#1f2a44"}
        strokeWidth={steep ? 2.4 : 1.8}
      />

      {/* lens */}
      <ellipse
        cx={steep ? 108 : 112}
        cy="80"
        rx={steep ? 11 : 9}
        ry={steep ? 22 : 18}
        fill="#eef2f5"
        stroke={steep ? "#c0392b" : "#1f2a44"}
        strokeWidth={steep ? 2.2 : 1.6}
      />

      {/* rays through optics to focus */}
      <line
        x1="78"
        y1="58"
        x2={focusX}
        y2="80"
        stroke="#e86a2d"
        strokeWidth="2"
      />
      <line
        x1="78"
        y1="102"
        x2={focusX}
        y2="80"
        stroke="#e86a2d"
        strokeWidth="2"
      />
      {variant !== "normal" && (
        <>
          <line
            x1={focusX}
            y1="80"
            x2={retinaX - 8}
            y2="62"
            stroke="#e86a2d"
            strokeWidth="1.6"
          />
          <line
            x1={focusX}
            y1="80"
            x2={retinaX - 8}
            y2="98"
            stroke="#e86a2d"
            strokeWidth="1.6"
          />
          <circle cx={focusX} cy="80" r="2.4" fill="#e86a2d" />
        </>
      )}

      {/* labels */}
      <text x="52" y="48" fontSize="9" fill="#6b7280">
        Cornea
      </text>
      <text x="96" y="80" fontSize="9" fill="#374151" textAnchor="middle">
        Lens
      </text>
      <text x={retinaX + 8} y="76" fontSize="9" fill="#6b7280">
        Retina
      </text>
      {long && (
        <>
          <line
            x1={globeCx + 20}
            y1="128"
            x2={globeCx + globeRx - 6}
            y2="128"
            stroke="#374151"
            strokeWidth="1"
            markerEnd="url(#arrow)"
          />
          <text x={globeCx + 18} y="142" fontSize="8" fill="#4b5563">
            Elongation of the eye
          </text>
        </>
      )}
      <defs>
        <marker
          id="arrow"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="#4b5563" />
        </marker>
      </defs>
    </svg>
  );
}

const PANELS = [
  {
    key: "normal",
    variant: "normal" as const,
    title: "A normal eye",
    bg: "bg-[#f8e6d8]",
    text: "The eye brings (parallel) light from distant objects into focus on the back of the eye (the retina) without the internal lens in the eye having to do anything at all.",
  },
  {
    key: "refractive",
    variant: "refractive" as const,
    title: "Refractive myopia",
    bg: "bg-[#d9e6f0]",
    text: "Refractive myopia is caused by either one or more of the optical surfaces becoming too steep (curvature myopia) and/or where the refractive index of the optical media is too high (index myopia).",
  },
  {
    key: "axial",
    variant: "axial" as const,
    title: "Axial myopia",
    bg: "bg-[#e6f0d4]",
    text: "In axial myopia, the optical system is correctly powered but the eyeball has increased in length, increasing the focal length and causing light to be focused in front of the retina.",
  },
];

export function MyopiaTypesExplainer() {
  return (
    <section className="no-print mt-8 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <div className="border-b border-slate-200 bg-white px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">
          Why axial length matters
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Most childhood myopia is axial — the eye has grown too long. That is
          why this tracker plots AL, not just the glasses prescription.
        </p>
      </div>
      <div className="grid md:grid-cols-3">
        {PANELS.map((panel) => (
          <article
            key={panel.key}
            className={`${panel.bg} px-5 py-6 text-center`}
          >
            <h3 className="text-base font-bold text-slate-900">{panel.title}</h3>
            <EyeSvg variant={panel.variant} />
            <p className="mx-auto mt-1 max-w-xs text-sm leading-relaxed text-slate-700">
              {panel.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
