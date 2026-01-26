import { QUOTE_HISTORY_SUMMARY_CONFIG } from '@ui/env';
import type { ReactNode } from 'react';
import styles from './FXPage.module.css';
import type { FxTableStates } from './FXTableContext.ts';
import { FXTableContext } from './FXTableContext.ts';

export interface FXTableProps extends FxTableStates {
  title: string;
  children: ReactNode;
}

export function FXTable({
  title,
  children,
  ...states
}: FXTableProps): ReactNode {
  return (
    <FXTableContext.Provider value={states}>
      <table className={styles.fxTable}>
        <colgroup>
          <col />
          <col />
          {QUOTE_HISTORY_SUMMARY_CONFIG.map(({ duration }) => (
            <col data-duration={duration} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th>{title}</th>
            <th></th>
            {QUOTE_HISTORY_SUMMARY_CONFIG.map(({ duration }) => (
              <th data-duration={duration}>{duration}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </FXTableContext.Provider>
  );
}
