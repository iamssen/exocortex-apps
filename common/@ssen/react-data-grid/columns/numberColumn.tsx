import clsx from 'clsx/lite';
import type { Column } from 'react-data-grid';
import { Format } from '../../format/components.tsx';
import cellStyles from '../cellStyles.module.css';
import type { ValueSelector } from '../select.ts';
import { selectValue } from '../select.ts';

interface FormatColumn<Row> extends Omit<Column<Row>, 'renderCell'> {
  format?: string;
  select: ValueSelector<Row, number>;
  referenceFormat?: never;
  selectReference?: never;
}

interface SubFormatColumn<Row> extends Omit<Column<Row>, 'renderCell'> {
  format?: string;
  select: ValueSelector<Row, number>;
  referenceFormat?: string;
  selectReference?: ValueSelector<Row, number>;
}

type C<Row> = FormatColumn<Row> | SubFormatColumn<Row>;

export function numberColumn<Row>({
  format,
  select,
  referenceFormat,
  selectReference,
  cellClass,
  ...options
}: C<Row>): Column<Row> {
  return {
    renderCell: ({ row }) => {
      const value = selectValue(row, select);
      const subValue = selectReference
        ? selectValue(row, selectReference)
        : undefined;
      return (
        <>
          <sub>
            {typeof subValue === 'number' && subValue !== 0 && (
              <span>
                (<Format format={referenceFormat} n={subValue} />)
              </span>
            )}
          </sub>
          <Format format={format} n={value} replacer="-" />
        </>
      );
    },
    cellClass: (row) => {
      return clsx(
        referenceFormat
          ? cellStyles.cellSpaceBetween
          : cellStyles.cellRightAlign,
        typeof cellClass === 'function' ? cellClass(row) : cellClass,
      );
    },
    ...options,
  };
}
