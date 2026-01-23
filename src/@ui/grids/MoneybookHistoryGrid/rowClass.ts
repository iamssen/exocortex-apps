import type { MoneybookHistory } from '@iamssen/exocortex';
import { clsx } from 'clsx/lite';
import { minimatch } from 'minimatch';
import rowStyles from '../rowStyles.module.css';

function categoryMatch(category: string): string | undefined {
  if (
    minimatch(category, '식비/{주식,업무,건강}') ||
    minimatch(category, '생활비/{이동통신,인터넷}') ||
    minimatch(category, '공과금/{,/*}') ||
    category === '교통/대중교통'
  ) {
    return rowStyles.gridRowUnimportant;
  } else if (
    category === '운동' ||
    minimatch(category, '여가/{영화,레저,예술,데이트,체험}') ||
    minimatch(category, '지식{,/*}') ||
    minimatch(category, '여행{,/*}')
  ) {
    return rowStyles.gridRowPositive;
  } else if (
    category === '술' ||
    category === '담배' ||
    minimatch(category, '교통/{택시,범칙금}') ||
    minimatch(category, '여가/{웹소설,웹툰,유흥}')
  ) {
    return rowStyles.gridRowNegative;
  }

  return undefined;
}

function amountMatch(_category: string, amount: number): string | undefined {
  if (amount > 1_000_000) {
    return rowStyles.gridRowImportant;
  }

  return undefined;
}

export function rowClass({
  category,
  amount,
}: MoneybookHistory): string | null {
  return clsx(categoryMatch(category), amountMatch(category, amount));
}
