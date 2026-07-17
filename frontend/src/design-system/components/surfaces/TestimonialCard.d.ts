import React from 'react';
export interface TestimonialCardProps {
  quote: React.ReactNode;
  name: React.ReactNode;
  role?: React.ReactNode;
  /** Author avatar image URL. */
  avatar?: string;
  style?: React.CSSProperties;
}
export function TestimonialCard(props: TestimonialCardProps): JSX.Element;
