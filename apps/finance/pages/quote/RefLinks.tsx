import { useQuoteRefs } from '@ui/data-utils';
import type { ReactNode } from 'react';
import styles from './QuotePage.module.css';

export interface RefLinksProps {
  symbol: string;
}

export function RefLinks({ symbol }: RefLinksProps): ReactNode {
  const links = useQuoteRefs(symbol);

  if (links.length === 0) {
    return null;
  }

  return (
    <ul className={styles.etfHoldings}>
      {links.map(({ title, link }) => (
        <li key={link}>
          <a href={link} target="ref-link">
            {title}
          </a>
        </li>
      ))}
    </ul>
  );
}
