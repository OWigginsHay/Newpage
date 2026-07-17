---
name: newpage-design
description: Use this skill to generate well-branded interfaces and assets for Newpage (Newpage Solutions — life-sciences digital engineering), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Key files:
- `readme.md` — full brand guide: content voice, visual foundations, iconography, component + UI-kit index.
- `styles.css` — link this one file; it `@import`s all design tokens and fonts.
- `tokens/` — colour, typography, spacing and effect CSS custom properties.
- `components/` — reusable React primitives (Button, Tag, Badge, Card, ServiceCard, TestimonialCard, StatBlock, StepCard, Input, Accordion, SectionHeading).
- `ui_kits/website/` — interactive recreation of the newpage.io marketing site.
- `assets/` — logo lockups (black / white / icon-only mark).

Brand essentials: Roboto typeface; primary teal `#08BDB8` (dark `#008C85`), yellow `#FFCF36`, orange `#FF7F1F` accents; pill buttons; soft cool-neutral card shadows; near-black dark sections; uppercase teal eyebrows; no emoji; Lucide icons.
