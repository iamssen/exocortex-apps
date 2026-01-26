import type { RescuetimeSummaryChartQuery } from '@ui/charts';

export const rescuetimeSummaryQuery: RescuetimeSummaryChartQuery[] = [
  {
    name: 'Very Productive',
    value: ({ veryProductive }) => veryProductive,
    style: { color: '#1a53ff' },
  },
  {
    name: 'Productive',
    value: ({ productive }) => productive,
    style: { color: '#6f8de3' },
  },
  {
    name: 'Neutral',
    value: ({ neutral }) => neutral,
    style: { color: '#cccccc' },
  },
  {
    name: 'Distracting',
    value: ({ distracting }) => distracting,
    style: { color: '#da5454' },
  },
  {
    name: 'Very Distracting',
    value: ({ veryDistracting }) => veryDistracting,
    style: { color: '#b30000' },
  },
];
