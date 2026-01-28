import type { HistoryLineRecord } from './HistoryLine.tsx';

export function getHistoryLineLastRecord(
  records: HistoryLineRecord[][],
): HistoryLineRecord {
  return records.flat().toSorted((a, b) => b.timestamp - a.timestamp)[0];
}
