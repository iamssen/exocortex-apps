import type { Journal } from '@iamssen/exocortex';
import { DateTime } from 'luxon';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import styles from './JournalSummarySection.module.css';

interface JournalSummarySectionProps {
  data: Journal;
}

export function JournalSummarySection({
  data,
}: JournalSummarySectionProps): ReactNode {
  const start = DateTime.fromISO(data.entries[0].localCreationDate);
  const end = DateTime.fromISO(data.entries.at(-1)!.localCreationDate);

  return (
    <div className={styles.style}>
      <Link to="/journal/new">+ New Entry </Link>
      <Calendar start={start} end={end} data={data} />
    </div>
  );
}

function Calendar({
  start,
  end,
  data,
}: {
  start: DateTime;
  end: DateTime;
  data: Journal;
}) {
  const entriesByDate = new Map<string, Journal['entries']>();
  for (const entry of data.entries) {
    const date = DateTime.fromISO(entry.localCreationDate).toISODate();
    if (!date) continue;
    if (!entriesByDate.has(date)) {
      entriesByDate.set(date, []);
    }
    entriesByDate.get(date)!.push(entry);
  }

  const months: DateTime[] = [];
  let current = start.startOf('month');

  while (current <= end.endOf('month')) {
    months.push(current);
    current = current.plus({ months: 1 });
  }

  return (
    <section className={styles.calendars}>
      {months.toReversed().map((month, i) => (
        <MonthCalendar
          key={month.toISODate()}
          month={month}
          entriesByDate={entriesByDate}
          isFirst={i === 0}
        />
      ))}
    </section>
  );
}

function MonthCalendar({
  month,
  entriesByDate,
  isFirst,
}: {
  month: DateTime;
  entriesByDate: Map<string, Journal['entries']>;
  isFirst: boolean;
}) {
  const startOfMonth = month.startOf('month');

  // weekday: 1 is Monday, 7 is Sunday. We want weeks to start on Sunday.
  const firstDayOfWeek = startOfMonth.weekday % 7;
  const calendarStart = startOfMonth.minus({ days: firstDayOfWeek });

  const days: DateTime[] = [];
  let current = calendarStart;

  // Generate days for 6 weeks for a consistent grid.
  for (let i = 0; i < 42; i++) {
    days.push(current);
    current = current.plus({ days: 1 });
  }

  return (
    <div className={styles.month}>
      <h3>
        {isFirst || month.month === 1 ? (
          <Link to={`/journal/${month.toFormat('yyyy')}`}>
            {month.toFormat('yyyy')}{' '}
          </Link>
        ) : null}
        <Link to={`/journal/${month.toFormat('yyyy-MM')}`}>
          {month.toFormat('LLL')}
        </Link>
      </h3>
      <table>
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i}>
              {days.slice(i * 7, i * 7 + 7).map((day) => {
                if (day.month !== month.month) {
                  return (
                    <td
                      key={day.toISODate()}
                      className={styles.otherMonth}
                    ></td>
                  );
                }

                const dateStr = day.toISODate();
                const entries = dateStr
                  ? entriesByDate.get(dateStr)
                  : undefined;

                return (
                  <td key={dateStr} className={entries ? styles.hasEntry : ''}>
                    {entries ? (
                      <Link to={`/journal/${entries[0].localCreationDate}`}>
                        {day.day}
                      </Link>
                    ) : (
                      day.day
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
