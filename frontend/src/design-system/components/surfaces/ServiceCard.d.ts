import React from 'react';
/**
 * @startingPoint section="Surfaces" subtitle="Homepage service tiles" viewport="700x260"
 */
export interface ServiceCardProps {
  title: React.ReactNode;
  description: React.ReactNode;
  /** Icon or image rendered in the media block. */
  media?: React.ReactNode;
  href?: string;
  /** @default "dark" */
  tone?: 'dark' | 'light';
  style?: React.CSSProperties;
}
export function ServiceCard(props: ServiceCardProps): JSX.Element;
