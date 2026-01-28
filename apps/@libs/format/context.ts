import type { Context } from 'react';
import { createContext, useContext, useMemo } from 'react';
import type {
  FormatConfigProps,
  FormatFunction,
  FormatPreset,
} from './format.ts';
import { format } from './format.ts';

export const FormatConfigContext: Context<FormatConfigProps> =
  createContext<FormatConfigProps>({});

export function useFormatConfig(): FormatConfigProps {
  return useContext(FormatConfigContext);
}

export function useFormat(
  formatString: FormatPreset | string | undefined = '0,0[.][00]',
  replacer: string = '',
): FormatFunction {
  const config = useFormatConfig();

  return useMemo(
    () => format(formatString, replacer, config),
    [config, formatString, replacer],
  );
}
