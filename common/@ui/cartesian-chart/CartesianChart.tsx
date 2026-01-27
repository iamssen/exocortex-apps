import useResizeObserver from '@ssen/use-resize-observer';
import type {
  CSSProperties,
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
} from 'react';
import React, { isValidElement, useMemo } from 'react';
import { CartesianChartContext } from './CartesianChart.context.ts';
import { isSVGChild } from './CartesianChart.spec.ts';

export interface CartesianChartProps extends DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export function CartesianChart({
  className,
  style,
  children,
  ...props
}: CartesianChartProps): ReactNode {
  // @ts-ignore
  const { width = 600, height = 300, ref } = useResizeObserver();

  // 최적화 1: Context Value 메모이제이션
  const contextValue = useMemo(() => ({ width, height }), [width, height]);

  // 최적화 2: 레이어 분리 로직 메모이제이션
  const layers = useMemo(() => {
    const result: ReactNode[] = [];
    let svgBuffer: ReactNode[] = [];
    let groupIndex = 0;

    const flushBuffer = () => {
      if (svgBuffer.length > 0) {
        result.push(
          <svg
            key={`svg-layer-${groupIndex++}`}
            width={width + 20}
            height={height + 20}
            style={{
              position: 'absolute',
              margin: 0,
              left: -10,
              top: -10,
              pointerEvents: 'none',
            }}
          >
            <g style={{ pointerEvents: 'auto' }}>{svgBuffer}</g>
          </svg>,
        );
        svgBuffer = [];
      }
    };

    React.Children.forEach(children, (child) => {
      // 핵심 수정: 유효하지 않은 자식(null, false 등)은 루프에서 무시하여 버퍼 플러시 방지
      if (!isValidElement(child)) return;

      if (isSVGChild(child)) {
        svgBuffer.push(child);
      } else {
        flushBuffer();
        result.push(child);
      }
    });

    flushBuffer();
    return result;
  }, [children, width, height]);

  return (
    <CartesianChartContext.Provider value={contextValue}>
      <div
        ref={ref}
        role="img"
        aria-hidden="true"
        data-component="cartesian-chart"
        className={className}
        style={{ position: 'relative', ...style }}
        {...props}
      >
        {layers}
      </div>
    </CartesianChartContext.Provider>
  );
}
