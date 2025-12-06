import numeral from 'numeral';
import type { CurrencyType } from './env.ts';
import { currencySymbols } from './env.ts';

numeral.options.scalePercentBy100 = false;

export type FormatPreset =
  | CurrencyType
  | 'INTEGER'
  | 'PERCENT'
  | 'PERCENT_SIGN'
  | 'CENTIMETER'
  | 'KILOGRAM'
  | 'KCAL';

export type FormatFunction = (n: number | undefined | null) => string;

export interface FormatConfigProps {
  krwShortUnits?: boolean;
}

/** @link http://numeraljs.com */
export const format =
  (
    formatString: FormatPreset | string | undefined = '0,0[.][00]',
    replacer: string = '',
    config: FormatConfigProps = {},
  ): FormatFunction =>
  (n: number | undefined | null) => {
    if (typeof n !== 'number') {
      return replacer;
    }

    switch (formatString) {
      case 'INTEGER': {
        return numeral(n).format('0,0');
      }
      case 'PERCENT_SIGN': {
        return (n >= 0 ? '+' : '') + numeral(n).format('0,0[.][00]%');
      }
      case 'PERCENT': {
        return numeral(n).format('0,0[.][00]%');
      }
      case 'POINT': {
        return numeral(n).format('0,0[.][00]');
      }
      case 'RATE': {
        return numeral(n).format('0,0[.][0000]');
      }
      case 'CENTIMETER': {
        return numeral(n).format('0,0[.][00]') + 'cm';
      }
      case 'KILOGRAM': {
        return numeral(n).format('0,0[.][00]') + 'Kg';
      }
      case 'KCAL': {
        return numeral(n).format('0,0[.][00]') + 'Kcal';
      }
      default: {
        if (config.krwShortUnits && formatString === 'KRW') {
          const res = formatKRWShort(n);
          if (res) return res;
        }

        if (formatString in currencySymbols) {
          return formatCurrency(n, formatString as CurrencyType);
        }

        return numeral(n).format(formatString);
      }
    }
  };

function formatKRWShort(n: number): string | null {
  const abs = Math.abs(n);

  if (abs > 100_000_000_000) {
    const sign = n < 0 ? '-' : '';
    const symbol = currencySymbols['KRW'];
    const number = abs / 100_000_000;
    const trillion = Math.floor(number / 10_000);
    const trillionString =
      trillion > 0 ? numeral(trillion).format('0,0') + '조' : '';
    return (
      sign +
      symbol +
      trillionString +
      (trillionString.length > 0 ? '\u200A' : '') +
      numeral(number - trillion * 10_000).format('0,0') +
      '억'
    );
  }

  if (abs > 100_000) {
    const sign = n < 0 ? '-' : '';
    const symbol = currencySymbols['KRW'];
    const number = abs / 10_000;
    const hundredMillion = Math.floor(number / 10_000);
    const hundredMillionString =
      hundredMillion > 0 ? numeral(hundredMillion).format('0,0') + '억' : '';
    const tenThousand =
      hundredMillion > 0 ? number - hundredMillion * 10_000 : number;
    const tenThousandString =
      tenThousand < 1
        ? ''
        : tenThousand < 100
          ? numeral(tenThousand).format('0,0[.][00]') + '만'
          : tenThousand < 1000
            ? numeral(tenThousand).format('0,0[.][0]') + '만'
            : numeral(tenThousand).format('0,0') + '만';
    return (
      sign +
      symbol +
      hundredMillionString +
      (hundredMillionString.length > 0 && tenThousandString.length > 0
        ? '\u200A'
        : '') +
      tenThousandString
    );
  }

  return null;
}

function formatCurrency(n: number, currency: CurrencyType): string {
  const sign = n < 0 ? '-' : '';
  const symbol = currencySymbols[currency];
  const number = Math.abs(n);
  const string =
    number < 0.1
      ? numeral(number).format('0.[0000]')
      : number < 100
        ? numeral(number).format('0,0[.][00]')
        : number < 1000
          ? numeral(number).format('0,0[.][0]')
          : numeral(number).format('0,0');
  return `${sign}${symbol}${string}`;
}
