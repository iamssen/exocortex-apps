import { useFormat } from '@ssen/format';
import type { ReactNode, SVGProps } from 'react';
import { useMemo } from 'react';
import type {
  CartesianChartAxis,
  CartesianChartSvgComponent,
} from './CartesianChart.spec.ts';
import { HorizontalLine } from './HorizontalLine.tsx';

export interface PriceLineData {
  formatString?: string | undefined;
  formatReplacer?: string;
  price: number;
  watchFor?: 'low' | 'high';
}

export interface PriceLineProps extends PriceLineData, SVGProps<SVGGElement> {
  axis: CartesianChartAxis;
  hideNumber?: boolean;
}

export const PriceLine: CartesianChartSvgComponent<PriceLineProps> = ({
  formatString,
  formatReplacer = '',
  price,
  watchFor,
  axis,
  hideNumber = false,
  style,
  ...props
}: PriceLineProps): ReactNode => {
  const format = useFormat(formatString, formatReplacer);

  const label = useMemo(() => {
    if (hideNumber) {
      return undefined;
    }

    return format(price);
  }, [format, hideNumber, price]);

  return (
    <HorizontalLine
      label={label}
      axis={axis}
      value={price}
      {...props}
      data-wait-for={watchFor}
    />
  );
};

PriceLine.isSVG = true;
