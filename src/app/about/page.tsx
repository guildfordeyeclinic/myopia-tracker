import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CLINIC_NAME, CLINIC_URL } from "@/data/references";

const pageTitle = "About Myopia Management Tracker | Guildford Eye Clinic";
const pageDescription =
  "Myopia Management Tracker (myopia-tracker.com) is an interactive, color-coded axial length (AL) percentile tool — one of the easiest ways to track AL-based myopia control and myopia management. Ethnicity- and sex-specific charts (European and East Asian), LT/AL buffering, Bennett crystalline lens power, and print-friendly reports for optometrists.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "axial length percentile chart",
    "pediatric axial length",
    "myopia management calculator",
    "AL growth chart",
    "East Asian European axial length",
    "Tideman axial length",
    "Sanz Diez lens growth",
    "Bennett crystalline lens power",
    "LT/AL myopia buffering",
    "optometry myopia control",
    "Guildford Eye Clinic",
    "axial length tracking children",
    "myopia risk percentile",
    "interactive color coded axial length chart",
    "easiest myopia control tracking",
    "color coded myopia management",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: "website",
    locale: "en_CA",
    siteName: "Myopia Management Tracker | Guildford Eye Clinic",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Myopia Management Tracker",
      url: "https://myopia-tracker.com",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      description: pageDescription,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "CAD",
      },
      provider: {
        "@type": "MedicalClinic",
        name: CLINIC_NAME,
        url: CLINIC_URL,
      },
      about: [
        {
          "@type": "MedicalCondition",
          name: "Myopia",
        },
        {
          "@type": "MedicalSpecialty",
          name: "Optometry",
        },
      ],
      featureList: [
        "Interactive color-coded axial length percentile graph for myopia control",
        "Easiest method to track axial length–based myopia management visually",
        "Ethnicity-specific axial length percentile charts (European and East Asian)",
        "Sex-specific pediatric AL growth reference curves",
        "Delta vs age-matched median (P50)",
        "Illustrative untreated AL projection to age 18",
        "LT/AL buffering interpretation",
        "Bennett modified crystalline lens power calculator",
        "Print-friendly black-and-white growth graph",
      ],
    },
    {
      "@type": "WebPage",
      name: pageTitle,
      description: pageDescription,
      isPartOf: {
        "@type": "WebSite",
        name: "Myopia Management Tracker",
        url: "https://myopia-tracker.com",
      },
      about: {
        "@type": "Thing",
        name: "Axial length growth charts for myopia management",
      },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "h2", ".speakable-summary"],
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is an axial length percentile chart for myopia management?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "An axial length (AL) percentile chart plots a child’s measured eye length against age-, sex-, and ethnicity-specific reference curves. Higher percentiles indicate longer eyes relative to peers and are used in myopia risk discussion and treatment monitoring.",
          },
        },
        {
          "@type": "Question",
          name: "Why is Myopia Management Tracker easy for axial length–based myopia control?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Myopia Management Tracker is interactive and color-coded: enter age, sex, ethnicity, and OD/OS axial length and the graph updates immediately with color percentile bands, labeled curves, and plain-language results. That visual feedback is designed to be one of the easiest ways to track and explain AL-based myopia management compared with raw numbers alone.",
          },
        },
        {
          "@type": "Question",
          name: "Why use separate European and East Asian axial length charts?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Published growth charts differ by population. European references (e.g. Tideman et al.) and Chinese/East Asian schoolchildren references (e.g. Sanz Diez et al.) show different typical AL for the same age and sex. Using the wrong chart can under- or over-estimate relative risk.",
          },
        },
        {
          "@type": "Question",
          name: "Is this axial length calculator a medical device or diagnosis tool?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. This is an educational decision-support tool for eye-care professionals and families. It does not replace optical biometry, clinical examination, or professional judgment.",
          },
        },
        {
          "@type": "Question",
          name: "What is Bennett crystalline lens power used for?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Bennett’s method (and modifications such as Hernandez et al.) estimates absolute crystalline lens power from refraction and biometry (AL, ACD, LT, keratometry) without phakometry. Remaining buffer is judged with age-adjusted minima: ≤ +18.5 D at ages 6–9, ≤ +17.0 D at 10–13, and ≤ +15.5 D at 14–18.",
          },
        },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader
        title="About Myopia Management Tracker"
        subtitle="For optometrists, ophthalmologists & families"
      />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <article className="prose prose-slate max-w-none">
          <p className="speakable-summary rounded-xl border border-teal-100 bg-white p-5 text-base leading-relaxed text-slate-700 shadow-sm">
            <strong>Myopia Management Tracker</strong> (myopia-tracker.com) is an{" "}
            <strong>interactive, color-coded</strong> axial length tool built to
            be one of the{" "}
            <strong>
              easiest methods to track axial length–based myopia control and
              myopia management
            </strong>
            . Enter biometry and instantly see OD/OS on sex- and
            ethnicity-specific percentile growth charts—with color bands, plain
            language results, and optional LT/AL buffering plus a Bennett
            crystalline lens power calculator. Provided by{" "}
            <a
              href={CLINIC_URL}
              className="font-medium text-teal-800 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              {CLINIC_NAME}
            </a>
            .
          </p>

          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
            >
              Open the free AL calculator →
            </Link>
          </div>

          <h2 className="mt-10 text-xl font-bold text-slate-900">
            Who this site is for
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 leading-relaxed">
            <li>
              <strong>Optometrists and ophthalmologists</strong> monitoring
              childhood myopia progression with optical biometry
            </li>
            <li>
              <strong>Myopia management clinics</strong> educating parents about
              axial length, percentiles, and treatment goals
            </li>
            <li>
              <strong>Families</strong> reviewing AL measurements with their
              eye-care professional (not a substitute for clinical care)
            </li>
          </ul>

          <h2 className="mt-10 text-xl font-bold text-slate-900">
            Interactive and color-coded — easy AL-based tracking
          </h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            Static tables and raw biometry printouts are hard for parents (and
            busy clinics) to interpret. Myopia Management Tracker is{" "}
            <strong>interactive</strong>: change age, sex, ethnicity, or OD/OS
            axial length and the graph updates immediately. It is{" "}
            <strong>color-coded</strong> so risk zones and percentile bands read
            at a glance—green through amber to red—making it one of the{" "}
            <strong>
              easiest ways to track and explain axial length–based myopia
              control
            </strong>{" "}
            without hunting through paper charts.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 leading-relaxed">
            <li>
              <strong>Interactive inputs</strong> — no software install; enter
              measurements and see results in one click
            </li>
            <li>
              <strong>Color-coded percentile bands</strong> — visual map from
              lower-risk to higher-risk AL for age/sex/ethnicity
            </li>
            <li>
              <strong>Clear takeaways</strong> — percentile, mm vs P50, untreated
              outlook, and combo-treatment prompt at ≥ 90th percentile
            </li>
            <li>
              <strong>Parent-friendly printout</strong> — B&W graph plus key
              numbers for chairside education
            </li>
          </ul>

          <h2 className="mt-10 text-xl font-bold text-slate-900">
            What the calculator does
          </h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            Axial length is a core metric in modern myopia management because
            elongation of the eye is tightly linked to progressive myopia and
            long-term risk of pathologic complications. Population{" "}
            <strong>percentile growth charts</strong> help place a single AL
            value in context of age, sex, and ethnicity—similar to height and
            weight charts used in pediatrics.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 leading-relaxed">
            <li>
              Plot OD and OS axial length on a{" "}
              <strong>color-coded percentile graph</strong> (P5–P95)
            </li>
            <li>
              Compare to the age-matched <strong>P50 (median)</strong> in mm
            </li>
            <li>
              Show an <strong>illustrative untreated projection</strong> to age
              18 and the <strong>26 mm</strong> high-myopia risk line
            </li>
            <li>
              Flag <strong>≥ 90th percentile</strong> with a combo-treatment
              recommendation prompt for clinical discussion
            </li>
            <li>
              Optional <strong>AL/CR</strong> and <strong>LT/AL</strong>{" "}
              buffering bands when corneal radius and lens thickness are entered
            </li>
            <li>
              Separate <strong>modified Bennett lens power</strong> section
              (cycloplegic SE, ACD, LT, AL, mean K)
            </li>
            <li>
              <strong>Print graph</strong> mode for B&W clinic printers (graph +
              key numbers only)
            </li>
          </ul>

          <h2 className="mt-10 text-xl font-bold text-slate-900">
            Ethnicity-specific axial length charts
          </h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            Mean axial length trajectories differ between European and East Asian
            pediatric populations. This tool lets you choose the reference that
            best matches the child:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 leading-relaxed">
            <li>
              <strong>European:</strong> Tideman et al. European children AL
              growth percentiles (sex-specific anchors; intermediate ages
              interpolated)
            </li>
            <li>
              <strong>East Asian (Chinese-reference):</strong> Sanz Diez et al.
              LMS percentiles for Chinese schoolchildren in Wuhan (ages 6–15;
              light extension for display beyond table range)
            </li>
          </ul>
          <p className="mt-3 text-slate-700 leading-relaxed">
            Ages under 6 can still be plotted using{" "}
            <strong>linear extrapolation</strong> of the published curves, with
            an on-screen warning that estimates are less accurate than in-range
            values.
          </p>

          <h2 className="mt-10 text-xl font-bold text-slate-900">
            Clinical framing (educational)
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 leading-relaxed">
            <li>
              Percentiles ≥ 50th are often discussed as higher myopia risk; ≥
              75th as higher risk of high myopia in published growth-chart
              practice narratives
            </li>
            <li>
              A common structural goal in myopia control is to keep AL under{" "}
              <strong>26 mm</strong> where possible
            </li>
            <li>
              <strong>LT/AL:</strong> &gt; 0.14 still some buffering left;
              0.13–0.135 buffer running low; &lt; 0.126 buffering completely gone
              (clinic teaching bands on this site)
            </li>
            <li>
              <strong>Crystalline lens power:</strong> remaining buffer is
              judged with age-adjusted Bennett minima — ages 6–9 depleted at ≤
              +18.5 D (typical ~+21 to +23 D); ages 10–13 at ≤ +17.0 D; ages
              14–18 at ≤ +15.5 D (biological floor)
            </li>
          </ul>

          <h2 className="mt-10 text-xl font-bold text-slate-900">
            Scientific sources
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 leading-relaxed text-sm">
            <li>
              Poon N. Axial Length: An Essential for Myopia Management. BC
              Doctors of Optometry.
            </li>
            <li>
              Tideman JWL, et al. Axial length growth and the risk of developing
              myopia in European children. Acta Ophthalmol. 2018.
            </li>
            <li>
              Sanz Diez P, et al. LMS parameters, percentile, and Z-score growth
              curves for axial length in Chinese schoolchildren in Wuhan. Sci
              Rep. 2022;12:4850.
            </li>
            <li>
              Hernandez VM, et al. Calculation of crystalline lens power using a
              modification of the Bennett method. Biomed Opt Express.
              2015;6(11):4501–4515.
            </li>
            <li>
              Related: Diez et al. 2019; He et al. 2023 AL/AL-CR percentiles;
              IMI clinical management guidelines.
            </li>
          </ul>

          <h2 className="mt-10 text-xl font-bold text-slate-900">
            Important limitations
          </h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            This website is an <strong>educational tool</strong>, not a
            regulated medical device and not a diagnosis. Percentile curves are
            population references, not pure emmetrope-only norms. Untreated
            projections use simplified literature growth-rate bands and are not
            individualized predictions. Always interpret optical biometry in the
            full clinical context with a licensed practitioner.
          </p>

          <h2 className="mt-10 text-xl font-bold text-slate-900">
            About Guildford Eye Clinic
          </h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            This tool is provided for educational use in association with{" "}
            <a
              href={CLINIC_URL}
              className="font-medium text-teal-800 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              {CLINIC_NAME}
            </a>
            . Practitioners and patients seeking myopia management and pediatric
            eye care can visit the clinic website for services and appointments.
          </p>

          <h2 className="mt-10 text-xl font-bold text-slate-900">
            Frequently asked questions
          </h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h3 className="font-semibold text-slate-900">
                Why is this easier than paper axial length charts?
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                The tracker is interactive and color-coded. Instead of looking up
                tables or tracing static PDFs, you enter AL and immediately see
                where the eye sits on European or East Asian percentile bands—
                designed as a simple visual method for axial length–based myopia
                management and parent education.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h3 className="font-semibold text-slate-900">
                Can other clinics use this free AL percentile calculator?
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                Yes. The public calculator is intended for educational use by
                eye-care professionals and families. Cite the underlying papers
                when using charts in teaching materials, and do not present the
                tool as a diagnostic device.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h3 className="font-semibold text-slate-900">
                How do I track myopia with axial length instead of only
                refraction?
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                Measure AL with optical biometry, plot on an appropriate
                age/sex/ethnicity growth chart, review percentile change over
                time, and discuss treatment success when elongation approaches
                physiologic rates or when the percentile falls. This site
                visualizes a single visit for education and printouts.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h3 className="font-semibold text-slate-900">
                What keywords describe this tool for myopia management?
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                Myopia management tracker, myopia-tracker.com, pediatric axial
                length percentile chart, myopia control AL growth curves,
                European vs Asian axial length norms, LT/AL buffering, Bennett
                lens power calculator, print-ready AL report for optometry.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
            >
              Use the calculator
            </Link>
            <a
              href={CLINIC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Visit {CLINIC_NAME}
            </a>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
