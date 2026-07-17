import React from 'react';
export interface StepCardProps {
  /** Step number — zero-padded automatically. */
  number: number | string;
  title: React.ReactNode;
  description: React.ReactNode;
  style?: React.CSSProperties;
}
export function StepCard(props: StepCardProps): JSX.Element;
