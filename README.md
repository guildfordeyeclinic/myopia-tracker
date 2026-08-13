# Myopia Management Tracker

Public educational website (**myopia-tracker.com**) for plotting a child’s **axial length (AL)** on **sex- and ethnicity-specific** percentile growth charts.

Built for [Guildford Eye Clinic](https://guildfordeyeclinic.ca) — original tool using published research (not a clone of commercial apps).

## Features (MVP)

- Single measurement form: age, sex, ethnicity, OD/OS AL
- Optional corneal radius or mean K → AL/CR insight
- Color-banded percentile chart with labeled centiles (P5–P95)
- Δ vs age-matched **P50** (“X.XX mm longer/shorter”)
- Illustrative untreated projection to age 18 + **26 mm** line
- European (Tideman anchors) vs East Asian / Chinese-reference (Sanz Diez 2022 LMS)
- Link to [guildfordeyeclinic.ca](https://guildfordeyeclinic.ca)
- No accounts or patient profiles

## Run locally

```bash
cd al-growth-tracker
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test
npm run build
```

## Deploy

Static-friendly Next.js app. Deploy to Vercel or Cloudflare:

```bash
npm run build
```

Set project root to `al-growth-tracker/`.

## Data sources

- Sanz Diez et al. 2022 *Sci Rep* — LMS percentiles, Wuhan Chinese schoolchildren
- Tideman et al. 2018 *Acta Ophthalmol* — European AL growth percentiles (anchors)
- Clinical framing: [BC Doctors of Optometry – Axial Length](https://bc.doctorsofoptometry.ca/news/axial-length-an-essential-for-myopia-management/)

See on-site **Sources & methods** for full citations and limitations.

## Disclaimer

Educational decision-support aid only. Not a medical device or diagnosis.
