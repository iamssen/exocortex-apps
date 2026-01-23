import type { JoinedHolding, PortfolioMarket } from '@iamssen/exocortex';
import type { Column } from 'react-data-grid';

const excludeColumns: Record<PortfolioMarket, Set<string>> = {
  us: new Set(),
  kr: new Set(['roa', 'roe', 'beta']),
  jp: new Set(['roa', 'roe', 'beta']),
  fx: new Set(['per', 'pbr', 'roa', 'roe', 'beta']),
  crypto: new Set(['per', 'pbr', 'roa', 'roe', 'beta']),
};

export function filterColumns(
  columns: Column<JoinedHolding>[],
  portfolio: PortfolioMarket,
): Column<JoinedHolding>[] {
  const exclude = excludeColumns[portfolio];
  return columns.filter(({ key }) => !exclude.has(key));
}
