import React from 'react';
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  /** Error message; also turns the field red. */
  error?: React.ReactNode;
  containerStyle?: React.CSSProperties;
}
export function Input(props: InputProps): JSX.Element;
