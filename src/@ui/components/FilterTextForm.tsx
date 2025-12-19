import { clsx } from 'clsx/lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  DataHTMLAttributes,
  DetailedHTMLProps,
  FormEvent,
  ReactNode,
} from 'react';
import { MdFilterAlt, MdFilterAltOff, MdOutlineClear } from 'react-icons/md';
import component from './FilterTextForm.module.css';

export interface FilterTextFormProps extends Omit<
  DetailedHTMLProps<DataHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
  'onChange'
> {
  autoFocus?: boolean;
  filterText: string;
  placeholderText: string;
  onChange: (nextFilterText: string) => void;
}

export function FilterTextForm({
  autoFocus = false,
  filterText,
  placeholderText,
  onChange,
  className,
  ...props
}: FilterTextFormProps): ReactNode {
  const [tempFilterText, setTempFilterText] = useState('');

  useEffect(() => {
    setTempFilterText(filterText);
  }, [filterText]);

  const availableSubmit = useMemo(() => {
    return filterText.trim() !== tempFilterText.trim();
  }, [filterText, tempFilterText]);

  const submit = useCallback(
    (event?: FormEvent) => {
      const next = tempFilterText.trim();
      onChange(next);
      event?.preventDefault();
    },
    [onChange, tempFilterText],
  );

  const clear = useCallback(() => {
    setTempFilterText('');
    submit();
  }, [submit]);

  return (
    <form
      onSubmit={submit}
      className={clsx(className, component.style)}
      {...props}
    >
      <input
        type="text"
        placeholder={placeholderText}
        autoFocus={autoFocus}
        value={tempFilterText}
        onChange={({ target }) => setTempFilterText(target.value)}
      />
      {!availableSubmit && filterText.length > 0 ? (
        <button onClick={clear}>
          <MdOutlineClear />
        </button>
      ) : (
        <button type="submit" disabled={!availableSubmit}>
          {filterText.length === 0 ? <MdFilterAltOff /> : <MdFilterAlt />}
        </button>
      )}
    </form>
  );
}
