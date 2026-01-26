import type { Iso8601 } from '@iamssen/exocortex';
import { clsx } from 'clsx/lite';
import type { DurationLike } from 'luxon';
import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import component from './SingleDateSelect.module.css';

export interface DateItem {
  label: string;
  value: Iso8601;
}

export interface DurationItem {
  label: string;
  duration: DurationLike;
}

export interface SingleDateSelectProps extends Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
  'ref' | 'children' | 'onChange'
> {
  dates: DateItem[];
  selectedDate: DateItem;
  onChange: (nextDate: DateItem) => void;
}

export function SingleDateSelect({
  dates,
  selectedDate,
  onChange,
  className,
  ...ulProps
}: SingleDateSelectProps): ReactNode {
  const ulRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!ulRef.current) return;
    const selected = ulRef.current?.querySelector('li[aria-selected="true"]');
    if (!selected) return;
    ulRef.current.scroll({ left: selected.getBoundingClientRect().left });
  }, []);

  return (
    <ul
      role="radiogroup"
      ref={ulRef}
      {...ulProps}
      className={clsx(className, component.style)}
    >
      {dates.map((date) => (
        <li
          key={date.label}
          role="radio"
          aria-checked={selectedDate.label === date.label}
          onClick={() => onChange(date)}
        >
          {date.label} - <sub>{date.value}</sub>
        </li>
      ))}
    </ul>
  );
}
