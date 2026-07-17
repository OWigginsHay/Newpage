/**
 * Newpage Design System — public entry point.
 *
 * Runtime primitives are authored as `.jsx` with hand-written `.d.ts` types
 * alongside; the app resolves types from the declarations and Vite bundles the
 * `.jsx` at build time. Global tokens + fonts come from `styles.css`, imported
 * once in `main.tsx`.
 *
 * Brand guide and specimen cards live in `docs/design-system/`.
 */
export { Button } from "./components/core/Button";
export type { ButtonProps } from "./components/core/Button";
export { Tag } from "./components/core/Tag";
export type { TagProps } from "./components/core/Tag";
export { Badge } from "./components/core/Badge";
export type { BadgeProps } from "./components/core/Badge";

export { Card } from "./components/surfaces/Card";
export type { CardProps } from "./components/surfaces/Card";
export { ServiceCard } from "./components/surfaces/ServiceCard";
export type { ServiceCardProps } from "./components/surfaces/ServiceCard";
export { TestimonialCard } from "./components/surfaces/TestimonialCard";
export type { TestimonialCardProps } from "./components/surfaces/TestimonialCard";

export { StatBlock } from "./components/data/StatBlock";
export type { StatBlockProps } from "./components/data/StatBlock";
export { StepCard } from "./components/data/StepCard";
export type { StepCardProps } from "./components/data/StepCard";

export { Input } from "./components/forms/Input";
export type { InputProps } from "./components/forms/Input";
export { Accordion } from "./components/disclosure/Accordion";
export type { AccordionProps } from "./components/disclosure/Accordion";

export { SectionHeading } from "./components/typography/SectionHeading";
export type { SectionHeadingProps } from "./components/typography/SectionHeading";

export { default as logoBlack } from "./assets/logo-black.svg";
export { default as logoWhite } from "./assets/logo-white.svg";
export { default as logoIcon } from "./assets/logo-icon.svg";
