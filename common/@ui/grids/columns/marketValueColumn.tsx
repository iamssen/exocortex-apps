import { Evaluate, Format } from '@ssen/format';
import type { ValueSelector } from '@ssen/react-data-grid';
import { cellStyles, selectValue } from '@ssen/react-data-grid';
import clsx from 'clsx/lite';
import type { Column } from 'react-data-grid';

interface C<Row> extends Omit<Column<Row>, 'renderCell'> {
  format?: string;
  totalMarketValuePropertyName?: string;
  selectMarketValue: ValueSelector<Row, number>;
}

export function marketValueColumn<Row>({
  format,
  totalMarketValuePropertyName = 'totalMarketValue',
  selectMarketValue: sm,
  cellClass,
  ...options
}: C<Row>): Column<Row> {
  return {
    renderCell: ({ row }) => {
      const marketValue = selectValue(row, sm);
      const expr = `marketValue / ${totalMarketValuePropertyName} * 100`;
      return (
        <>
          <sub>
            (<Evaluate format="PERCENT" expr={expr} value={{ marketValue }} />)
          </sub>
          <Format format={format} n={marketValue} replacer="-" />
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
