import React from 'react';
/**
 * @startingPoint section="Typography" subtitle="Eyebrow + title + lead" viewport="700x200"
 */
export interface SectionHeadingProps {
  /** Short uppercase label with a teal bar. */
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  /** Supporting intro paragraph. */
  lead?: React.ReactNode;
  /** @default "left" */
  align?: 'left' | 'center';
  /** Use light text on a dark background. @default false */
  onDark?: boolean;
  style?: React.CSSProperties;
}
export function SectionHeading(props: SectionHeadingProps): JSX.Element;
