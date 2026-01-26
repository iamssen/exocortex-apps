import type {
  MoneybookChartQuery,
  MoneybookSummaryChartQuery,
} from '@ui/charts';

const colors = [
  '#b30000',
  '#7c1158',
  '#4421af',
  '#1a53ff',
  '#0d88e6',
  '#00b7c7',
  '#5ad45a',
  '#8be04e',
  '#ebdc78',
];

export const summaryQuery: MoneybookSummaryChartQuery[] = [
  {
    name: 'Riskless',
    value: ({ risklessValue }) => risklessValue,
    style: { color: colors[5] },
  },
  {
    name: 'Stocks',
    value: ({ stocksValue }) => stocksValue,
    style: { color: colors[3] },
  },
  {
    name: 'Crypto',
    value: ({ cryptoValue }) => cryptoValue,
    style: { color: colors[0] },
  },
];

export const usdSummaryQuery: MoneybookSummaryChartQuery[] = [
  {
    name: 'USD Cash',
    value: ({ usd }) => usd.cash,
    style: { color: colors[5] },
  },
  {
    name: 'Riskless',
    value: ({ usd }) => usd.riskless,
    style: { color: colors[3] },
  },
  {
    name: 'Stocks',
    value: ({ usd }) => usd.stocks,
    style: { color: colors[0] },
  },
];

export const jpySummaryQuery: MoneybookSummaryChartQuery[] = [
  {
    name: 'JPY Cash',
    value: ({ jpy }) => jpy.cash,
    style: { color: colors[5] },
  },
  {
    name: 'Stocks',
    value: ({ jpy }) => jpy.stocks,
    style: { color: colors[0] },
  },
];

export const krwSummaryQuery: MoneybookSummaryChartQuery[] = [
  {
    name: 'KRW Housing',
    value: ({ krw }) => krw.housing,
    style: { color: colors[6] },
  },
  {
    name: 'Cash',
    value: ({ krw }) => krw.cash + krw.otherCurrencies,
    style: { color: colors[5] },
  },
  {
    name: 'Riskless',
    value: ({ krw }) => krw.riskless,
    style: { color: colors[3] },
  },
  {
    name: 'Stocks',
    value: ({ krw }) => krw.stocks,
    style: { color: colors[0] },
  },
];

export const cryptoSummaryQuery: MoneybookSummaryChartQuery[] = [
  {
    name: 'Crypto Stable',
    value: ({ crypto }) => crypto.stable,
    style: { color: colors[5] },
  },
  {
    name: 'Coins',
    value: ({ crypto }) => crypto.coins,
    style: { color: colors[0] },
  },
];

export const totalQuery: MoneybookChartQuery[] = [
  {
    name: '종합소득세, 지방세',
    match: (category) =>
      category === '공과금/종합소득세' || category === '공과금/지방세',
    style: { color: colors[0] },
  },
  {
    name: '렌트비',
    match: (category) => category === '주거/렌트비',
    style: { color: colors[1] },
  },
  {
    name: '식비 + 술',
    match: (category) => category.startsWith('식비') || category === '술',
    style: { color: colors[2] },
  },
  {
    name: '그 외, 전체 소비',
    match: (category) =>
      category !== '공과금/종합소득세' &&
      category !== '공과금/지방세' &&
      category !== '주거/렌트비' &&
      !category.startsWith('식비') &&
      category !== '술',
    style: { color: colors[4] },
  },
];

export const foodQuery: MoneybookChartQuery[] = [
  {
    name: '술',
    match: (category) => category === '술',
    style: { color: colors[0] },
  },
  {
    name: '식비',
    match: (category) => category.startsWith('식비'),
    style: { color: colors[1] },
  },
];

export const lifeQuery: MoneybookChartQuery[] = [
  {
    name: '가구&가전',
    match: (category) => category === '생활비/가구&가전',
    style: { color: colors[0] },
  },
  {
    name: '생활비',
    match: (category) =>
      category.startsWith('생활비') && category !== '생활비/가구&가전',
    style: { color: colors[1] },
  },
  {
    name: '교통',
    match: (category) => category.startsWith('교통'),
    style: { color: colors[2] },
  },
  {
    name: '의료',
    match: (category) => category.startsWith('의료'),
    style: { color: colors[3] },
  },
  {
    name: '주거',
    match: (category) => category.startsWith('주거'),
    style: { color: colors[4] },
  },
];

export const investQuery: MoneybookChartQuery[] = [
  {
    name: '운동',
    match: (category) => category === '운동',
    style: { color: colors[0] },
  },
  {
    name: '여가',
    match: (category) => category.startsWith('여가'),
    style: { color: colors[1] },
  },
  {
    name: '생산성',
    match: (category) => category.startsWith('생산성'),
    style: { color: colors[2] },
  },
  {
    name: '지식',
    match: (category) => category.startsWith('지식'),
    style: { color: colors[3] },
  },
  {
    name: '패션',
    match: (category) => category.startsWith('패션'),
    style: { color: colors[4] },
  },
  {
    name: '여행',
    match: (category) => category.startsWith('여행'),
    style: { color: colors[5] },
  },
];
