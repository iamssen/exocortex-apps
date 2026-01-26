import type { DataHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';
import { FormatConfigContext, useFormatConfig } from './context.ts';
import type { FormatConfigProps, FormatPreset } from './format.ts';
import { format } from './format.ts';

export interface FormatProps extends Omit<
  DetailedHTMLProps<DataHTMLAttributes<HTMLDataElement>, HTMLDataElement>,
  'value'
> {
  format?: FormatPreset | string | undefined;
  replacer?: string;
  n: number | undefined | null;
}

export function Format({
  format: formatString = '0,0[.][00]',
  replacer = '',
  n,
  ...dataProps
}: FormatProps): ReactNode {
  const config = useFormatConfig();

  const print = (() => {
    if (
      typeof n !== 'number' ||
      formatString === 'PERCENT' ||
      formatString === 'INTEGER' ||
      formatString === 'RATE' ||
      formatString === 'POINT'
    ) {
      return format(formatString, replacer, config)(n);
    }

    const str = format(formatString, replacer, config)(n);
    let pointIndex = str.indexOf('.');

    if (pointIndex === -1) {
      if (config.krwShortUnits && str.endsWith('만')) {
        pointIndex = str.length - 1;
      } else {
        return str;
      }
    }

    return (
      <>
        {str.slice(0, Math.max(0, pointIndex))}
        <sub style={{ fontSize: '0.9em' }}>
          {str.slice(Math.max(0, pointIndex))}
        </sub>
      </>
    );
  })();

  return (
    <data {...dataProps} data-format={formatString} value={n?.toString()}>
      {print}
    </data>
  );
}

export function FormatConfig({
  children,
  ...config
}: FormatConfigProps & {
  children: ReactNode;
}): ReactNode {
  return (
    <FormatConfigContext.Provider value={config}>
      {children}
    </FormatConfigContext.Provider>
  );
}
