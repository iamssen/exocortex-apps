import type { MoneybookHistory } from '@iamssen/exocortex';
import { minimatch } from 'minimatch';
import minimist from 'minimist';
import { buildMinimistArgv } from './buildMinimistArgv.ts';

export const FILTER_OPTIONS = {
  FROM: 'from',
  TO: 'to',
  CATEGORY: 'category',
  MIN: 'min',
  MAX: 'max',
};

export function filterMoneybookHistory(
  history: MoneybookHistory[],
  filterText: string,
): MoneybookHistory[] {
  if (filterText.trim().length === 0) {
    return history;
  }

  const { _, ...options } = minimist(buildMinimistArgv(filterText));

  let list = [...history];

  if (
    FILTER_OPTIONS.FROM in options &&
    /^\d{4}/.test(options[FILTER_OPTIONS.FROM])
  ) {
    const timestamp = new Date(options[FILTER_OPTIONS.FROM]).getTime();
    list = list.filter(({ date }) => new Date(date).getTime() >= timestamp);
  }

  if (
    FILTER_OPTIONS.TO in options &&
    /^\d{4}/.test(options[FILTER_OPTIONS.TO])
  ) {
    const timestamp = new Date(options[FILTER_OPTIONS.TO]).getTime();
    list = list.filter(({ date }) => new Date(date).getTime() <= timestamp);
  }

  if (
    FILTER_OPTIONS.MIN in options &&
    /^\d+$/.test(options[FILTER_OPTIONS.MIN])
  ) {
    const num = +options[FILTER_OPTIONS.MIN];
    list = list.filter(({ amount }) => amount >= num);
  }

  if (
    FILTER_OPTIONS.MAX in options &&
    /^\d+$/.test(options[FILTER_OPTIONS.MAX])
  ) {
    const num = +options[FILTER_OPTIONS.MAX];
    list = list.filter(({ amount }) => amount <= num);
  }

  if (
    FILTER_OPTIONS.CATEGORY in options &&
    options[FILTER_OPTIONS.CATEGORY].length > 0
  ) {
    const searchCategory = options[FILTER_OPTIONS.CATEGORY];
    list = list.filter(({ category }) => minimatch(category, searchCategory));
  }

  const searchKeywords = _.filter((text) => {
    try {
      return text.trim().length > 0;
    } catch {
      return false;
    }
  });

  if (searchKeywords.length === 0) {
    return list;
  }

  return list.filter(({ description, event }) =>
    searchKeywords
      .filter(
        (text: any): text is string =>
          typeof text === 'string' && text.length > 0,
      )
      .some(
        (text: string) =>
          (description && description.includes(text)) ||
          (event && event.includes(text)),
      ),
  );
}
