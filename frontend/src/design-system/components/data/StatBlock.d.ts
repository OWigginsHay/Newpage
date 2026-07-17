import React from 'react';
/**
 * @startingPoint section="Data" subtitle="Headline metric" viewport="700x160"
 */
export interface StatBlockProps {
  value: React.ReactNode;
  label: React.ReactNode;
  /** @default "teal" */
  accent?: 'teal' | 'yellow' | 'orange' | 'dark';
  /** @default "left" */
  align?: 'left' | 'center';
  style?: React.CSSProperties;
}
export function StatBlock(props: StatBlockProps): JSX.Element;
