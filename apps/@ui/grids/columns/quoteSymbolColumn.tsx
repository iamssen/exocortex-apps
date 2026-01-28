import type { ValueSelector } from '@libs/react-data-grid';
import { selectValue } from '@libs/react-data-grid';
import type { Column } from 'react-data-grid';
import { Link } from 'react-router';

interface DisplayNameColumn<Row> extends Omit<Column<Row>, 'renderCell'> {
  selectSymbol: ValueSelector<Row, string>;
  printDisplayName: boolean;
  selectDisplayName: ValueSelector<Row, string>;
}

interface SymbolOnlyColumn<Row> extends Omit<Column<Row>, 'renderCell'> {
  selectSymbol: ValueSelector<Row, string>;
  printDisplayName?: never;
  selectDisplayName?: never;
}

type C<Row> = DisplayNameColumn<Row> | SymbolOnlyColumn<Row>;

export function quoteSymbolColumn<Row>({
  selectSymbol,
  selectDisplayName,
  printDisplayName = false,
  ...options
}: C<Row>): Column<Row> {
  return {
    renderCell: ({ row }) => {
      const symbol = selectValue(row, selectSymbol);
      const displayName =
        printDisplayName && selectDisplayName
          ? selectValue(row, selectDisplayName)
          : symbol;
      return <Link to={`/quote/${symbol}`}>{displayName ?? symbol}</Link>;
    },
    ...options,
  };
}
