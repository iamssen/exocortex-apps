import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router';
import { Page } from '../../Page.tsx';
import styles from './TradesListPage.module.css';

export function TradesListPage(
  props: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
): ReactNode {
  return (
    <Page layout="scrollable" className={styles.style}>
      <ul {...props}>
        <li>
          <Link to="/trades/us">US</Link>
        </li>
        <li>
          <Link to="/trades/kr">KR</Link>
        </li>
        <li>
          <Link to="/trades/jp">JP</Link>
        </li>
        <li>
          <Link to="/trades/fx">FX</Link>
        </li>
        <li>
          <Link to="/trades/crypto">Crypto</Link>
        </li>
      </ul>
    </Page>
  );
}
