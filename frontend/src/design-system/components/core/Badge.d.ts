import React from 'react';
export interface BadgeProps {
  children: React.ReactNode;
  /** @default "success" */
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'brand';
  /** Show a leading status dot. @default false */
  dot?: boolean;
  style?: React.CSSProperties;
}
export function Badge(props: BadgeProps): JSX.Element;
