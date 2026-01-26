import type { DESC, WeeklyBody } from '@iamssen/exocortex';
import { OPTIMAL_CALORIES } from '@ui/env';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import type { DataGridProps } from 'react-data-grid';
import { DataGrid } from 'react-data-grid';
import styles from '../styles.module.css';
import { createColumns } from './columns.tsx';

export interface WeeklyKcalGridProps extends Omit<
  DataGridProps<WeeklyBody>,
  'columns' | 'rowClass' | 'rowHeight' | 'rows'
> {
  rows: DESC<WeeklyBody>;
}

export function WeeklyKcalGrid({
  className,
  ...props
}: WeeklyKcalGridProps): ReactNode {
  const columns = useMemo(() => {
    return createColumns();
  }, []);

  const printColumns = useMemo(() => {
    const { week, mon, tue, wed, thu, fri, sat, sun } = columns;

    return [week, mon, tue, wed, thu, fri, sat, sun];
  }, [columns]);

  return (
    <DataGrid
      {...props}
      className={`${styles.grid} ${className}`}
      columns={printColumns}
      rowClass={rowClass}
      rowHeight={55}
      headerRowHeight={25}
    />
  );
}

function rowClass({ avgDayKcal }: WeeklyBody): string | null {
  return avgDayKcal && avgDayKcal < OPTIMAL_CALORIES
    ? styles.gridRowUnimportant
    : null;
}
