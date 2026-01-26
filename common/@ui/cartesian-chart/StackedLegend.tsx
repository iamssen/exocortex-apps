import { clsx } from 'clsx/lite';
import type {
  CSSProperties,
  DetailedHTMLProps,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
} from 'react';
import { useCallback } from 'react';
import component from './StackedLegend.module.css';

export interface Stacked {
  name: string;
  style: CSSProperties;
}

export interface StackedLegendProps extends DetailedHTMLProps<
  HTMLAttributes<HTMLUListElement>,
  HTMLUListElement
> {
  data: Stacked[];
  selectedNames: string[];
  onSelectNames: (enableNames: string[], disableNames: string[]) => void;
}

export function StackedLegend({
  selectedNames,
  onSelectNames,
  data,
  className,
}: StackedLegendProps): ReactNode {
  const onClick = useCallback(
    (evt: MouseEvent, name: string, nextSelection: boolean) => {
      if (evt.metaKey) {
        const otherNames = data
          .filter((item) => item.name !== name)
          .map((item) => item.name);

        if (nextSelection) {
          onSelectNames([name], otherNames);
        } else {
          onSelectNames(otherNames, [name]);
        }
      } else {
        if (nextSelection) {
          onSelectNames([name], []);
        } else {
          onSelectNames([], [name]);
        }
      }
    },
    [data, onSelectNames],
  );

  return (
    <ul className={clsx(component.style, className)}>
      {data.map(({ name, style }) => {
        const s = selectedNames.includes(name);
        return (
          <li
            key={name}
            style={style}
            data-selected={s}
            onClick={(evt) => onClick(evt, name, !s)}
          >
            <span>{name}</span>
          </li>
        );
      })}
    </ul>
  );
}
