import type { Iso8601 } from '@iamssen/exocortex';
import { clsx } from 'clsx/lite';
import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import component from './SingleDateSelect.module.css';

export interface MultiDateSelectProps extends Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
  'ref' | 'children' | 'onChange'
> {
  dates: Iso8601[];
  selectedDates: Iso8601[];
  onChange: (nextDates: Iso8601[]) => void;
}

export function MultiDateSelect({
  dates,
  selectedDates,
  onChange,
  className,
  ...ulProps
}: MultiDateSelectProps): ReactNode {
  const ulRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!ulRef.current) return;
    const selected = ulRef.current?.querySelector('li[aria-selected="true"]');
    if (!selected) return;
    ulRef.current.scroll({ left: selected.getBoundingClientRect().left });
  }, []);

  return (
    <ul
      role="group"
      ref={ulRef}
      {...ulProps}
      className={clsx(className, component.style)}
    >
      {dates.map((date) => (
        <li
          key={date}
          role="checkbox"
          aria-checked={selectedDates.includes(date)}
          onClick={() => {
            const nextSelectedDates = new Set(selectedDates);
            if (nextSelectedDates.has(date)) {
              nextSelectedDates.delete(date);
            } else {
              nextSelectedDates.add(date);
            }
            onChange(dates.filter((d) => nextSelectedDates.has(d)));
          }}
        >
          {date}
        </li>
      ))}
    </ul>
  );
}
