import type { Iso8601 } from '@iamssen/exocortex';
import type { Column } from 'react-data-grid';
import type { ValueSelector } from '../select.ts';
import { selectValue } from '../select.ts';

interface C<Row> extends Omit<Column<Row>, 'renderCell'> {
  format?: (date: Iso8601) => string;
  select: ValueSelector<Row, Iso8601>;
}

export function iso8601Column<Row>({
  format,
  select,
  cellClass,
  ...options
}: C<Row>): Column<Row> {
  return {
    renderCell: ({ row }) => {
      const value = selectValue(row, select);
      return (
        value && <time dateTime={value}>{format ? format(value) : value}</time>
      );
    },
    ...options,
  };
}
