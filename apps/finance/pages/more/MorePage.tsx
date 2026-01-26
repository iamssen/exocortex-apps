import { useQuery } from '@tanstack/react-query';
import { OutLink } from '@ui/components';
import { api } from '@ui/query';
import type { ReactNode } from 'react';
import { MdAvTimer, MdOutlineBookmarkBorder } from 'react-icons/md';
import { Link } from 'react-router';
import { Page } from '../../Page.tsx';
import styles from './MorePage.module.css';

export function MorePage(): ReactNode {
  const { data: linksData } = useQuery(api('links'));

  return (
    <Page layout="scrollable" className={styles.style}>
      <section className={styles.trades}>
        <h2>
          <MdAvTimer /> Trades
        </h2>
        <ul>
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
      </section>

      {linksData && (
        <section>
          <h2>
            <MdOutlineBookmarkBorder /> Links
          </h2>
          <ul>
            {linksData?.map(({ title, link }) => (
              <li key={link}>
                <OutLink href={link}>{title}</OutLink>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Page>
  );
}
