import type { Iso8601, Journal, JournalEntry } from '@iamssen/exocortex';
import { DateTime } from 'luxon';
import type { ReactNode } from 'react';
import { useMatch } from 'react-router';
import { Page } from '../../Page';
import { JournalSummarySection } from '../../sections/journal-summary/JournalSummarySection';

export interface JournalReadPageProps {
  data: Journal;
}

export function JournalReadPage({ data }: JournalReadPageProps): ReactNode {
  const {
    params: { pattern },
  } = useMatch('/journal/:pattern') ?? { params: {} };

  const dateRange = parseDatePattern(pattern);

  let entries: JournalEntry[];

  if (dateRange) {
    const from = DateTime.fromISO(dateRange[0]).toMillis();
    const to = DateTime.fromISO(dateRange[1]).endOf('day').toMillis();

    entries = data.entries.filter((entry) => {
      const t = DateTime.fromISO(entry.creationDate).toMillis();

      return t >= from && t <= to;
    });
  } else {
    const matchedEntry = data.entries.find((entry) => entry.uuid === pattern);
    entries = matchedEntry ? [matchedEntry] : data.entries.toReversed();
  }

  return (
    <Page layout="scrollable" summary={<JournalSummarySection data={data} />}>
      {entries.map((post) => (
        <section key={post.uuid} data-id={post.uuid}>
          <h1>{post.title}</h1>
          <time dateTime={post.creationDate}>
            [{post.localCreationDate} of {post.timezone}]
          </time>
          <div
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: post.htmlText }}
          />
        </section>
      ))}
    </Page>
  );
}

function parseDatePattern(
  pattern: string | undefined,
): [Iso8601, Iso8601] | null {
  if (!pattern) return null;

  const [startStr, endStr] = pattern.split('/');

  const from = getStartDate(startStr);
  // endStr가 없으면(undefined) startStr를 사용 (예: '2025' or '2025-10')
  const to = getEndDate(endStr || startStr);

  return [from as Iso8601, to as Iso8601];
}

/**
 * 입력된 문자열을 기준으로 YYYY-MM-DD 형식의 '시작일'을 생성합니다.
 * '2025' -> '2025-01-01'
 * '2025-10' -> '2025-10-01'
 * '2025-10-23' -> '2025-10-23'
 */
function getStartDate(str: string) {
  const parts = str.split('-');
  const year = parts[0];
  let month = '01';
  let day = '01';

  if (parts.length === 2) {
    // 'YYYY-MM'
    month = parts[1];
  } else if (parts.length === 3) {
    // 'YYYY-MM-DD'
    month = parts[1];
    day = parts[2];
  }

  // '2025-3-5' 같은 입력도 '2025-03-05'로 보정
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * 입력된 문자열을 기준으로 YYYY-MM-DD 형식의 '종료일'을 생성합니다.
 * '2025' -> '2025-12-31'
 * '2025-10' -> '2025-10-31' (해당 월의 마지막 날)
 * '2025-10-23' -> '2025-10-23'
 */
function getEndDate(str: string) {
  const parts = str.split('-');
  const year = Number.parseInt(parts[0], 10);

  if (parts.length === 1) {
    // 'YYYY'
    return `${year}-12-31`;
  }

  if (parts.length === 2) {
    // 'YYYY-MM'
    const month = Number.parseInt(parts[1], 10);
    // '2025-10'의 경우, 2025년 11월 0일을 구하면 10월의 마지막 날이 됨
    // new Date(year, month, 0) -> month는 1~12월 기준
    const lastDay = new Date(year, month, 0).getDate();
    return `${year}-${String(month).padStart(2, '0')}-${lastDay}`;
  }

  // 'YYYY-MM-DD'
  // '2025-3-5' 같은 입력도 '2025-03-05'로 보정
  const month = parts[1];
  const day = parts[2];
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}
