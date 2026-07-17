import React from 'react';

/**
 * @startingPoint section="Core" subtitle="Pill buttons in every variant" viewport="700x120"
 */
export interface ButtonProps {
  children: React.ReactNode;
  /** Visual style. @default "primary" */
  variant?: 'primary' | 'secondary' | 'dark' | 'ghost';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Show the up-right arrow glyph. @default false */
  arrow?: boolean;
  disabled?: boolean;
  as?: 'button' | 'a';
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
}
export function Button(props: ButtonProps): JSX.Element;
