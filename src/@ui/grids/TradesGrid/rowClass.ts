import type { JoinedTrade } from '@iamssen/exocortex';
import clsx from 'clsx/lite';
import rowStyles from '../rowStyles.module.css';

export function rowClass({ trade, quote }: JoinedTrade): string | null {
  if (!quote) {
    return null;
  } else if (trade.price === 0) {
    return rowStyles.gridRowUnimportant;
  }

  const diff =
    ((quote.price - trade.price) / trade.price) *
    100 *
    (trade.quantity < 0 ? -1 : 1);

  const className = clsx(
    // row의 배경색을 지정
    // 1. Sell trade인 경우 무조건 파란색
    // 2. Buy trade인 경우 가격이 10% 이상 상승한 경우에만 초록색
    // 3. 그 외의 경우 배경색 없음
    trade.quantity < 0
      ? rowStyles.gridRowNegative
      : quote.price > trade.price * 1.1
        ? rowStyles.gridRowPositive
        : null,
    // row의 텍스트 강조를 지정
    // 1. 손실이 20% 이상인 경우 매우 강하게 강조
    // 2. 손실이 2% 이상인 경우 강조
    // 3. 그 외의 경우 텍스트 강조 없음
    diff < -20
      ? rowStyles.gridRowSuperNegativeGain
      : diff < -2
        ? rowStyles.gridRowNegativeGain
        : null,
  );

  return className;
}
