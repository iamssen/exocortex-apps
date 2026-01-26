import type { JoinedTrade } from '@iamssen/exocortex';

export type JoinedTrade2 = Required<
  Omit<JoinedTrade, 'isFirstAppearedDate'>
> & {
  tradeAmount: number;
  diffRatio: number;
};

export interface PositionTrades {
  initialSellTrades: JoinedTrade2[];
  rebuyAfterDropTrades: JoinedTrade2[];
  intermediateTrades: JoinedTrade2[];
  // additionalRebuyTrades1: JoinedTrade2[];
}
