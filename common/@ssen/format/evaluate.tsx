import type { BigNumber } from 'mathjs';
import { compile, isBigNumber } from 'mathjs';
import type {
  Context,
  ProviderExoticComponent,
  ProviderProps,
  ReactNode,
} from 'react';
import { createContext, useContext, useMemo } from 'react';
import type { FormatProps } from './components.tsx';
import { Format } from './components.tsx';

type ScopeValue = Record<string, number | BigNumber | undefined | null>;

const ScopeContext: Context<ScopeValue> = createContext<ScopeValue>(null!);

export const Scope: ProviderExoticComponent<ProviderProps<ScopeValue>> =
  ScopeContext.Provider;

export interface EvaluateProps extends Omit<FormatProps, 'n'> {
  expr: string;
  value?: ScopeValue;
}

export function Evaluate({
  expr,
  value,
  ...formatProps
}: EvaluateProps): ReactNode {
  const scope = useContext(ScopeContext);

  const code = useMemo(() => compile(expr), [expr]);

  const n = useMemo(() => {
    try {
      const num = code.evaluate({ ...scope, ...value });
      return isBigNumber(num)
        ? num.toNumber()
        : typeof num === 'number'
          ? num
          : undefined;
    } catch {
      return undefined;
    }
  }, [code, scope, value]);

  return n ? <Format n={n} {...formatProps} /> : null;
}
