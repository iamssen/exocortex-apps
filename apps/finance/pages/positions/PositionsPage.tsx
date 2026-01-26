import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import { Link, Route, Routes } from 'react-router';
import { Page } from '../../Page.tsx';
import { Badge20240209, Position20240209 } from './2024-02-09/index.tsx';
import styles from './PositionsPage.module.css';

export function PositionsPage(): ReactNode {
  return (
    <Page layout="scrollable">
      <Routes>
        <Route index element={<PositionList className={styles.index} />} />
        <Route path="2024-02-09" element={<Position20240209 />} />
      </Routes>
    </Page>
  );
}

export function PositionList(
  props: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
): ReactNode {
  return (
    <ul {...props}>
      <li>
        <Link to="/position/2024-02-09">
          <Badge20240209 />
        </Link>
      </li>
    </ul>
  );
}
