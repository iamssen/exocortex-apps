import { useQuery } from '@tanstack/react-query';
import { api } from '@ui/query';
import type { ReactNode } from 'react';
import { Route, Routes } from 'react-router';
import { JournalNewPage } from './JournalNewPage.tsx';
import { JournalReadPage } from './JournalReadPage.tsx';

export function JournalPage(): ReactNode {
  const { data } = useQuery(api('journal'));

  if (!data) {
    return null;
  }

  return (
    <Routes>
      <Route path="new" element={<JournalNewPage />} />
      <Route path="*" element={<JournalReadPage data={data} />} />
    </Routes>
  );
}
