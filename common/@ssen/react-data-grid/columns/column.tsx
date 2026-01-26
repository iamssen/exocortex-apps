import type { ReactNode } from 'react';
import type { Column } from 'react-data-grid';
import type { ValueSelector } from '../select.ts';
import { selectValue } from '../select.ts';

interface C<Row> extends Omit<Column<Row>, 'renderCell'> {
  select: ValueSelector<Row, ReactNode>;
}

export function column<Row>({ select, ...options }: C<Row>): Column<Row> {
  return {
    renderCell: ({ row }) => {
      return selectValue(row, select);
    },
    ...options,
  };
}
