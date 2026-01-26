import type { ReactNode } from 'react';
import { MdMoreHoriz } from 'react-icons/md';
import component from './Separate.module.css';

export function Separator(): ReactNode {
  return (
    <div className={component.style} aria-hidden="true">
      <MdMoreHoriz />
    </div>
  );
}
