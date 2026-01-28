import type { MoneybookHistory } from '@iamssen/exocortex';
import { column, iso8601Column, numberColumn } from '@libs/react-data-grid';
import type { Column } from 'react-data-grid';
import { Link } from 'react-router';

interface ColumnOptions {
  currentEvent?: string;
}

export interface Columns {
  date: Column<MoneybookHistory>;
  category: Column<MoneybookHistory>;
  description: Column<MoneybookHistory>;
  amount: Column<MoneybookHistory>;
  event: Column<MoneybookHistory>;
}

export function createColumns({ currentEvent }: ColumnOptions): Columns {
  const date = iso8601Column<MoneybookHistory>({
    key: 'date',
    name: 'Date',
    frozen: true,
    minWidth: 100,
    maxWidth: 100,
    select: 'date',
  });

  const category = column<MoneybookHistory>({
    key: 'category',
    name: 'Category',
    minWidth: 100,
    maxWidth: 140,
    select: 'category',
  });

  const description = column<MoneybookHistory>({
    key: 'description',
    name: 'Description',
    minWidth: 120,
    maxWidth: 240,
    select: 'description',
  });

  const amount = numberColumn<MoneybookHistory>({
    key: 'amount',
    name: 'Amount',
    minWidth: 100,
    maxWidth: 120,
    format: 'KRW',
    select: 'amount',
  });

  const event = column<MoneybookHistory>({
    key: 'event',
    name: 'Event',
    select: (row) => {
      if (currentEvent) {
        if (
          row.event &&
          row.event.indexOf(currentEvent) === 0 &&
          row.event.length > currentEvent.length
        ) {
          const childPath = row.event.slice(currentEvent.length + 1);

          return (
            <>
              <span style={{ opacity: 0.3 }}>...</span>
              <Link to={`./${childPath}`}>/{childPath}</Link>
            </>
          );
        }

        return null;
      }

      if (row.event) {
        return <Link to={`/moneybook/event/${row.event}`}>{row.event}</Link>;
      }

      return row.event;
    },
  });

  return {
    date,
    category,
    description,
    amount,
    event,
  };
}
