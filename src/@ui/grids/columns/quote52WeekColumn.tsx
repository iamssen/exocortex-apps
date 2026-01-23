import type { JoinedQuoteStatistics } from '@iamssen/exocortex';
import { Format } from '@iamssen/exocortex-appkit/format';
import type { ValueSelector } from '@iamssen/exocortex-appkit/react-data-grid';
import {
  cellStyles,
  selectValue,
} from '@iamssen/exocortex-appkit/react-data-grid';
import clsx from 'clsx/lite';
import type { Column } from 'react-data-grid';

interface C<Row> extends Omit<Column<Row>, 'renderCell'> {
  format: string;
  select: ValueSelector<Row, JoinedQuoteStatistics>;
}

export function quote52WeekColumn<Row>({
  format: f,
  select,
  cellClass,
  ...options
}: C<Row>): Column<Row> {
  return {
    renderCell: ({ row }) => {
      const statistics = selectValue(row, select);

      if (!statistics?.fiftyTwoWeekRange) {
        return null;
      }

      const low = statistics.fiftyTwoWeekRange.low;
      const high = statistics.fiftyTwoWeekRange.high;
      const position = statistics.fiftyTwoWeekPosition ?? 0;

      let left: string | undefined = undefined;
      let right: string | undefined = undefined;

      if (position > 0.8) {
        left = 'muted'; // 가장 흐리게 (opacity: 0.3)
        right = 'negative'; // 강조
      } else if (position < 0.2) {
        left = 'positive'; // 강조
        right = 'muted'; // 가장 흐리게 (opacity: 0.3)
      } else if (position > 0.5) {
        left = 'subtle'; // 중간 흐리게 (opacity: 0.5)
      } else if (position < 0.5) {
        right = 'subtle'; // 중간 흐리게 (opacity: 0.5)
      }

      return (
        <>
          <Format format={f} n={low} data-state={left} />
          <span> - </span>
          <Format format={f} n={high} data-state={right} />
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
