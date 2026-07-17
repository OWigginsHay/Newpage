import React from 'react';
/**
 * @startingPoint section="Surfaces" subtitle="Elevated content surfaces" viewport="700x220"
 */
export interface CardProps {
  children: React.ReactNode;
  /** @default "sm" */
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  /** @default true */
  padded?: boolean;
  /** Lift + deepen shadow on hover. @default false */
  hover?: boolean;
  style?: React.CSSProperties;
}
export function Card(props: CardProps): JSX.Element;
