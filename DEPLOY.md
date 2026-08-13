# Deploy Myopia Management Tracker

Domain: **myopia-tracker.com** (+ **www.myopia-tracker.com**)

This app is a **static Next.js export** (`out/`).

---

## GitHub Pages (primary)

### Automated (already configured)

- Workflow: `.github/workflows/deploy-pages.yml`
- On push to `main`/`master`, builds and deploys `out/` to GitHub Pages
- `public/CNAME` → `myopia-tracker.com`

### One-time GitHub settings

1. Repo → **Settings** → **Pages**
2. **Source**: GitHub Actions
3. After first successful workflow, site is live on `https://<user>.github.io/<repo>/` until custom domain is set
4. **Custom domain**: `myopia-tracker.com` (CNAME file is already in the repo)
5. Enable **Enforce HTTPS** when available

### DNS at Cloudflare (domain on Cloudflare, hosting on GitHub Pages)

| Type | Name | Content | Proxy |
|------|------|---------|--------|
| **A** | `@` | `185.199.108.153` | DNS only (grey cloud) recommended for Pages |
| **A** | `@` | `185.199.109.153` | DNS only |
| **A** | `@` | `185.199.110.153` | DNS only |
| **A** | `@` | `185.199.111.153` | DNS only |
| **CNAME** | `www` | `<user>.github.io` | DNS only |

Or CNAME apex if Cloudflare supports CNAME flattening to `<user>.github.io`.

**www → apex redirect:** Cloudflare Redirect Rule, or GitHub Pages “www” support via CNAME to github.io.

Confirm current GitHub Pages IPs in [GitHub docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) if they change.

---

## Option B — Cloudflare Pages (alternative)

### 1. Put the code on GitHub

```bash
cd al-growth-tracker
git init   # if not already a repo
git add .
git commit -m "Myopia Management Tracker ready for Cloudflare"
# Create a GitHub repo, then:
git remote add origin https://github.com/YOUR_USER/myopia-tracker.git
git push -u origin main
```

### 2. Create a Pages project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Select the repo
3. Build settings:

| Setting | Value |
|--------|--------|
| Framework preset | **None** (or Next.js if listed; static export uses custom) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Root directory | `/` (or `al-growth-tracker` if the repo is the monorepo parent) |
| Environment variable | `NEXT_PUBLIC_SITE_URL` = `https://myopia-tracker.com` |
| Node version | `20` or `22` (Settings → Environment variables → `NODE_VERSION=20`) |

4. **Save and Deploy**

### 3. Attach the domain (apex + www)

1. Pages project → **Custom domains** → **Set up a custom domain**
2. Add **`myopia-tracker.com`**
3. Add **`www.myopia-tracker.com`**

Cloudflare will create DNS records if the domain is already on Cloudflare.

### 4. DNS checklist (domain already on Cloudflare)

In **Websites** → **myopia-tracker.com** → **DNS** → **Records**:

| Type | Name | Content | Proxy |
|------|------|---------|--------|
| **CNAME** | `@` or apex | `your-project.pages.dev` | Proxied (orange cloud) |
| **CNAME** | `www` | `your-project.pages.dev` | Proxied (orange cloud) |

If Cloudflare Pages “Custom domains” UI already added these, don’t duplicate them.

**Redirect www → apex (or apex → www):**

1. **Rules** → **Redirect Rules** → Create rule  
   **OR** Pages → Custom domains often offers a preferred domain.

Example: force `www` → apex:

- If hostname equals `www.myopia-tracker.com`
- Then dynamic redirect to `https://myopia-tracker.com${uri}`  
  Status **301**

(Or the reverse if you prefer www as primary.)

### 5. SSL

With orange-cloud proxy: **SSL/TLS** → mode **Full (strict)** after certificates are issued (usually automatic).

---

## Option B — Deploy from this PC (Wrangler CLI)

```bash
cd al-growth-tracker
npm install
npm install -D wrangler

# Login once
npx wrangler login

# Build + upload
npx wrangler pages project create myopia-tracker   # once
npm run build
npx wrangler pages deploy out --project-name=myopia-tracker
```

Or:

```bash
npm run deploy
```

Then attach **Custom domains** in the Pages UI as in step 3 above.

---

## After deploy

1. Open https://myopia-tracker.com and https://www.myopia-tracker.com  
2. Confirm `/about`, print, and calculator work  
3. In Google Search Console (optional): add property + submit `https://myopia-tracker.com/sitemap.xml`

---

## Local static preview

```bash
npm run build
npx serve out
```

---

## Troubleshooting

| Issue | Fix |
|--------|-----|
| 404 on `/about` | Ensure `trailingSlash: true` and build output is `out` (not `.next`) |
| Wrong site URL in sitemap | Set `NEXT_PUBLIC_SITE_URL=https://myopia-tracker.com` in Pages env |
| www doesn’t work | Add `www` as Custom domain **and** CNAME in DNS |
| Edge of page cut in print | Browser print margins = Default (not None) |
