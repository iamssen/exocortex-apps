import type { JoinedTrade, Trade } from '@iamssen/exocortex';
import { scaleLinear } from 'd3-scale';
import type { ReactNode, SVGProps } from 'react';
import { useMemo } from 'react';
import { useCartesianChart } from './CartesianChart.context.ts';
import type { CartesianChartAxis } from './CartesianChart.tsx';

export interface TradePointsData {
  trades: (JoinedTrade | Trade)[];
}

export interface TradePointsProps
  extends TradePointsData, SVGProps<SVGGElement> {
  axis: CartesianChartAxis;
}

export function TradePoints({
  trades,
  axis,
  style,
  ...props
}: TradePointsProps): ReactNode {
  const { width, height } = useCartesianChart();

  const xScale = useMemo(
    () => scaleLinear().range([0, width]).domain([axis.x.min, axis.x.max]),
    [axis.x.max, axis.x.min, width],
  );

  const yScale = useMemo(
    () => scaleLinear().range([height, 0]).domain([axis.y.min, axis.y.max]),
    [axis.y.max, axis.y.min, height],
  );

  const circleElements = useMemo(() => {
    return (
      <>
        {trades.map((trade, i) => {
          const t = 'trade' in trade ? trade.trade : trade;
          return (
            <circle
              key={`trade-${i}`}
              data-quantity={t.quantity}
              data-trade={t.quantity > 0 ? 'buy' : 'sell'}
              cx={xScale(new Date(t.date).getTime())}
              cy={yScale(t.price)}
              r={3}
            />
          );
        })}
      </>
    );
  }, [trades, xScale, yScale]);

  return (
    <g {...props} style={{ ...style, transform: 'translate(10px, 10px)' }}>
      {circleElements}
    </g>
  );
}
