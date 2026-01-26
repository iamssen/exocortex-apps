import type { MoneybookHistory } from '@iamssen/exocortex';
import type { ReactNode, Ref } from 'react';
import { useMemo } from 'react';
import type { Column, DataGridHandle, DataGridProps } from 'react-data-grid';
import { DataGrid } from 'react-data-grid';
import styles from '../styles.module.css';
import type { Columns } from './columns.tsx';
import { createColumns } from './columns.tsx';
import { rowClass } from './rowClass.ts';

export interface MoneybookHistoryGridProps extends Omit<
  DataGridProps<MoneybookHistory>,
  'columns' | 'rowClass' | 'rowHeight'
> {
  gridRef?: Ref<DataGridHandle>;
  excludeColumns?: Set<keyof Columns>;
  currentEvent?: string;
}

const columnNames = [
  'date',
  'category',
  'description',
  'amount',
  'event',
] as (keyof Columns)[];

export function MoneybookHistoryGrid({
  gridRef,
  className,
  excludeColumns,
  currentEvent,
  ...props
}: MoneybookHistoryGridProps): ReactNode {
  const columns = useMemo(() => {
    return createColumns({ currentEvent });
  }, [currentEvent]);

  const printColumns = useMemo(() => {
    const filteredColumnNames = excludeColumns
      ? columnNames.filter((columnName) => !excludeColumns.has(columnName))
      : columnNames;

    return filteredColumnNames.map(
      (columnName) => columns[columnName],
    ) as Column<MoneybookHistory>[];
  }, [columns, excludeColumns]);

  return (
    <DataGrid
      {...props}
      ref={gridRef}
      className={`${styles.grid} ${className}`}
      columns={printColumns}
      rowClass={rowClass}
      rowHeight={25}
    />
  );
}
