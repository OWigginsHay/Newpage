import React from 'react';
export interface TagProps {
  children: React.ReactNode;
  /** @default "teal" */
  tone?: 'teal' | 'yellow' | 'orange' | 'neutral' | 'solid';
  /** @default "md" */
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}
export function Tag(props: TagProps): JSX.Element;
