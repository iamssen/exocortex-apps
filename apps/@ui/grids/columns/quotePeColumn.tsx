import { Format } from '@libs/format';
import type { ValueSelector } from '@libs/react-data-grid';
import { cellStyles, selectValue } from '@libs/react-data-grid';
import clsx from 'clsx/lite';
import type { Column } from 'react-data-grid';

interface C<Row> extends Omit<Column<Row>, 'renderCell'> {
  selectTrailingPe: ValueSelector<Row, number>;
  selectForwardPe: ValueSelector<Row, number>;
}

export function quotePeColumn<Row>({
  selectTrailingPe,
  selectForwardPe,
  cellClass,
  ...options
}: C<Row>): Column<Row> {
  return {
    renderCell: ({ row }) => {
      const trailingPe = selectValue(row, selectTrailingPe);
      const forwardPe = selectValue(row, selectForwardPe);
      return (
        <>
          <Format n={trailingPe} />
          {typeof forwardPe === 'number' && (
            <>
              <sub>→</sub>
              <sub>
                <Format n={forwardPe} />
              </sub>
            </>
          )}
        </>
      );
    },
    cellClass: (row) => {
      return clsx(
        cellStyles.cellSpaceBetween,
        typeof cellClass === 'function' ? cellClass(row) : cellClass,
      );
    },
    ...options,
  };
}
