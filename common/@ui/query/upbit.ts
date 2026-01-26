import type { Iso8601, Ratio, Timestamp } from '@iamssen/exocortex';
import type {
  QueryFunction,
  QueryFunctionContext,
  UseQueryOptions,
} from '@tanstack/react-query';

async function queryFn(ctx: QueryFunctionContext<[string]>): Promise<any> {
  const symbol = ctx.queryKey[0];
  const res = await fetch(`https://api.upbit.com/v1/ticker?markets=${symbol}`);
  return res.json().then((data) => data[0]);
}

export function upbit(
  symbol: string,
  options?: Omit<UseQueryOptions<UpbitQuote>, 'queryKey' | 'queryFn'>,
): UseQueryOptions<UpbitQuote> {
  return {
    queryKey: [symbol],
    queryFn: queryFn as QueryFunction<UpbitQuote>,
    refetchInterval: 1000 * 60,
    ...options,
  };
}

interface UpbitQuote {
  market: string; //'KRW-USDT';
  trade_date: string; //'20241223';
  trade_time: string; //'075626';
  trade_date_kst: string; //'20241223';
  trade_time_kst: string; //'165626';
  trade_timestamp: Timestamp; //1734940586047;
  opening_price: number; //1521;
  high_price: number; //1522;
  low_price: number; //1510;
  trade_price: number; //1514;
  prev_closing_price: number; //1521;
  change: string; //'FALL';
  change_price: number; //7;
  change_rate: Ratio; //0.0046022354;
  signed_change_price: number; //-7;
  signed_change_rate: Ratio; //-0.0046022354;
  trade_volume: number; //1462.0450853;
  acc_trade_price: number; //111734370373.309;
  acc_trade_price_24h: number; //247806783341.55;
  acc_trade_volume: number; //73730638.7206361;
  acc_trade_volume_24h: number; //163478111.854436;
  highest_52_week_price: number; //1559;
  highest_52_week_date: Iso8601; //'2024-12-18';
  lowest_52_week_price: number; //1043;
  lowest_52_week_date: Iso8601; //'2024-12-03';
  timestamp: Timestamp; //1734940586079;
}
