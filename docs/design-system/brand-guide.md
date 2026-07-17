# Newpage Design System

A design system for **Newpage** (Newpage Solutions Inc. / Newpage Digital Healthcare Solutions) — a
life-sciences digital-engineering partner. Newpage helps pharmaceutical, biotech and healthcare
organizations solve complex technology problems across **Data & AI, Marketing Technologies, Digital
Health and Technical Services**, with a remote-first team across ~10 countries.

**Positioning:** "Deliver Breakthroughs with a trusted partner." The brand is confident,
engineering-led and enterprise-credible, but warm and human — it leads with outcomes for patients and
clients, not jargon.

## Sources used
- **Logo:** `uploads/Newpage_logo_black.svg` (provided). White + icon-only variants derived in `assets/`.
- **Website:** https://newpage.io — homepage copy, service taxonomy, stats, testimonials, FAQ and
  engagement flow were read from the live marketing site and used to ground the components and UI kit.
- **Font:** Roboto (specified by the user; confirmed as the site's typeface).

> No source codebase or Figma file was provided. Components and the UI kit are grounded in the public
> marketing website (newpage.io) and the brand mark. The website is the primary "product" surface.

---

## CONTENT FUNDAMENTALS

**Voice:** Confident, direct, outcomes-first. Copy speaks as **"we"** (the Newpage team) to **"you"**
(the client / life-sciences organization). It is professional and credible without being stiff.

- **Person:** First-person plural for Newpage ("We help drive technology transformation…", "We're a
  global team of problem-solvers…"); second person for the reader ("Transform your life sciences
  organization…", "Tell us about your project").
- **Casing:** Sentence case for body and most headings. Eyebrows/labels are UPPERCASE with wide
  tracking ("WHY NEWPAGE", "SERVICES"). Title case appears in nav items and proper nouns.
- **Tone:** Assertive and benefit-led. Headlines are short and punchy ("Deliver Breakthroughs with a
  trusted partner"). Supporting copy explains the *value* ("solutions that drive innovation and
  productivity"), then backs it with proof (stats, case studies, testimonials).
- **Numbers as proof:** Big rounded metrics with a "+" or "K+" suffix ("200+", "150K+", "27", "10")
  paired with a short plain-language label ("Projects delivered").
- **Vocabulary:** Life-sciences + enterprise-tech ("pharma, biotech", "GCC/ODC", "Salesforce/Veeva",
  "AEM", "compliance", "Net Zero", "GenAI", "computational psychiatry"). Precise, never buzzwordy for
  its own sake.
- **CTAs:** Action-oriented and specific — "Explore AI Solutions", "Learn more", "Discover more",
  "Contact us", "All case studies". Often paired with an up-right arrow.
- **Emoji:** **Not used.** The brand does not use emoji in product copy. Do not add them.
- **Vibe:** Trusted expert partner. "We challenge the conventional approach… championing innovation and
  leveraging emerging technologies to solve complex technology problems."

**Example headline + lead pattern:**
> **Deliver Breakthroughs with a trusted partner**
> Transform your life sciences organization with AI & Digital solutions that drive innovation and productivity.

---

## VISUAL FOUNDATIONS

**Colors.** The palette derives from the four-colour brand mark:
- **Teal `#08BDB8`** — the primary. Used for CTAs, links, accents, the eyebrow bar, and icon fills.
- **Teal Dark `#008C85`** — hover/pressed and gradient partner to teal.
- **Yellow `#FFCF36`** and **Orange `#FF7F1F`** — energetic secondary accents (stats, tags, gradients),
  used sparingly as highlights, never as large fields.
- **Neutrals** run near-white (`#F7F9F9`) to near-black (`#0C1213`). Text is near-black on white;
  dark sections use `--neutral-900` with light text.
- Max 1–2 background colours per surface; the site alternates white, a very light `--surface-subtle`,
  and near-black hero/testimonial/footer bands.

**Typography.** **Roboto** for everything (display through body); **Roboto Mono** for code/specimens.
Headlines are heavy — **Black (900)** for hero/display, **Bold (700)** for section titles and card
titles. Body is Regular (400) at 16px / 1.6 line-height. Eyebrows are Bold, uppercase, `.14em` tracking,
teal. Display headlines use tight tracking (`-0.02em`) and balanced wrapping.

**Spacing & layout.** 4px base scale. Content maxes at **1200px** with 24px gutters. Sections are
generously padded (~96px vertical). Grids of 3–4 equal columns are the workhorse layout (services,
stats, cases, steps).

**Corner radii.** Soft but not pill-everything: cards `16px`, media/inputs `10px`, small chips/icons
`6–10px`, **buttons and tags are fully pill (`999px`)**. The brand mark itself is hard-edged (no radius).

**Cards.** White surface, `1px` subtle neutral border, soft **cool-neutral shadow** (low-opacity,
large blur — `0 8px 24px rgba(12,18,19,.08)`). On hover they **lift** (`translateY(-4 to -6px)`) and the
shadow deepens. Service tiles invert to a near-black surface with a teal circular arrow. No coloured
left-border cards; no heavy borders.

**Backgrounds.** Mostly flat colour. Accents via **subtle radial glows** (e.g. a faint teal radial in
the dark hero) and **two-stop linear gradients** used only in small doses (teal→dark-teal,
yellow→orange) for media blocks and highlight chips. No photographic full-bleed textures, no grain, no
noise, no busy patterns. Imagery, where present on the live site, is clean and cool-toned.

**Motion.** Purposeful and quick. Standard easing `cubic-bezier(.4,0,.2,1)`; durations 120–320ms.
Hover = lift + shadow + colour shift; no bounces, no elaborate entrance choreography. Carousels/toggles
animate smoothly (max-height, transform).

**Hover / press states.** Buttons darken/soften on hover; links go from `--teal-600` to `--teal-700`.
Cards lift. Nav items get a soft teal pill background when active. Focus shows a **3px teal focus ring**
(`--focus-ring`). Press is a subtle settle (no aggressive shrink).

**Transparency & blur.** Used mainly on the sticky header (translucent white with `backdrop-filter`
blur when scrolled) and faint overlay glows. Otherwise surfaces are opaque.

**Quote motif.** A solid **teal double-quote mark** opens testimonials.

---

## ICONOGRAPHY

- The Newpage site uses small **single-colour SVG icons** and a distinctive **isometric brand mark**
  (a folded "new page" cube built from the four brand colours). The mark is in
  `assets/logo-icon.svg`; full lockups in `assets/logo-black.svg` / `assets/logo-white.svg`.
- **No brand icon font or public sprite was available** to copy. This system uses **Lucide**
  (https://lucide.dev) via CDN as the working icon set — clean, consistent 2px-stroke line icons that
  match Newpage's light, geometric style. **This is a substitution — flag to the user.** If Newpage has
  its own icon SVGs (e.g. the service icons, `white-arrow.svg`, `workflow-triangles.svg`,
  `quotes.svg` from the theme), drop them into `assets/` and swap the Lucide references.
- **Emoji are not used** as icons anywhere in the brand.
- The up-right arrow (↗) is a recurring functional glyph on links and CTAs; it's drawn inline as SVG in
  `Button` and `ServiceCard` and mirrored by Lucide elsewhere.

---

## Components
Reusable primitives (namespace `window.NewpageDesignSystem_<hash>` — run `check_design_system` for the
exact name). Each lives in `components/<group>/` with `.jsx`, `.d.ts`, `.prompt.md` and a card HTML.

- **Button** (`core/`) — pill CTA; variants primary / secondary / dark / ghost, sizes sm/md/lg, optional arrow.
- **Tag** (`core/`) — uppercase category pill (teal / yellow / orange / neutral / solid).
- **Badge** (`core/`) — status pill with optional dot (success / warning / danger / info / brand).
- **Card** (`surfaces/`) — base elevated surface; elevation + hover-lift.
- **ServiceCard** (`surfaces/`) — homepage service tile with media, title, description and teal arrow.
- **TestimonialCard** (`surfaces/`) — client quote with the teal quote mark and attribution.
- **StatBlock** (`data/`) — big brand-coloured metric over a short label.
- **StepCard** (`data/`) — numbered process step.
- **Input** (`forms/`) — labelled text field with hint/error and teal focus ring.
- **Accordion** (`disclosure/`) — FAQ disclosure list with rotating teal toggle.
- **SectionHeading** (`typography/`) — eyebrow + display title + optional lead.

### Intentional additions
- **Lucide** icon set (CDN) — substituted for Newpage's unavailable icon SVGs; see ICONOGRAPHY.

## UI kits
- **`ui_kits/website/`** — interactive recreation of the newpage.io marketing site. `index.html`
  composes `Header`, `HomePage`, `Sections`, `Pages`, `Footer` and `App`. Click-through nav across
  Home / Services / Case studies / Insights / Careers / About / Contact, a testimonial carousel, an
  FAQ accordion, and a working contact form (mock submit).

## Foundation cards
Specimen cards populate the **Design System** tab, grouped **Colors / Type / Spacing / Brand** in
`guidelines/`.

---

## Index / manifest (root)
- `styles.css` — entry point; `@import`s every token + font file (link this one file).
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`.
- `components/` — `core/`, `surfaces/`, `data/`, `forms/`, `disclosure/`, `typography/`.
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand).
- `ui_kits/website/` — marketing-site recreation.
- `assets/` — `logo-black.svg`, `logo-white.svg`, `logo-icon.svg`.
- `thumbnail.html` — homepage tile.
- `SKILL.md` — Agent-Skills-compatible entry point.

## Caveats / flags
- **Fonts not self-hosted.** Roboto + Roboto Mono load from Google Fonts CDN — no binaries were
  provided. Supply `.woff2` files to self-host.
- **Icons substituted.** Lucide stands in for Newpage's own icon SVGs (see ICONOGRAPHY).
- **White logo derived**, not provided — recoloured from the supplied black lockup.
- **No raster brand imagery** (service photos, avatars, hero images) was available to copy; the UI kit
  uses clean brand-colour/gradient blocks and Lucide icons in their place.
