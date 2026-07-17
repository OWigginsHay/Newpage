import React from 'react';
export interface AccordionItem {
  question: React.ReactNode;
  answer: React.ReactNode;
}
export interface AccordionProps {
  items: AccordionItem[];
  /** Allow more than one panel open at once. @default false */
  allowMultiple?: boolean;
  style?: React.CSSProperties;
}
export function Accordion(props: AccordionProps): JSX.Element;
