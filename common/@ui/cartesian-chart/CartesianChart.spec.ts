import type { FunctionComponent } from 'react';
import { isValidElement } from 'react';

export interface CartesianChartSvgComponent<
  P = {},
> extends FunctionComponent<P> {
  isSVG: true;
}

// 1. SVG 네이티브 태그 및 커스텀 SVG 컴포넌트 판별을 위한 셋업
const SVG_TAGS = new Set([
  'circle',
  'clipPath',
  'defs',
  'desc',
  'ellipse',
  'g',
  'image',
  'line',
  'linearGradient',
  'mask',
  'metadata',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'radialGradient',
  'rect',
  'stop',
  'svg',
  'switch',
  'symbol',
  'text',
  'textPath',
  'tspan',
  'use',
  'view',
]);

/** 컴포넌트 정의 시 `isSVG: true`를 정적으로 부여하여 판별 */
export function isSVGChild(child: any): boolean {
  if (!isValidElement(child)) return false;
  if (typeof child.type === 'string') return SVG_TAGS.has(child.type);
  return (child.type as any).isSVG === true;
}

export interface CartesianChartAxis {
  x: {
    min: number;
    max: number;
  };
  y: {
    min: number;
    max: number;
  };
}
