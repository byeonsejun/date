'use client';

import { SWRConfig } from 'swr';

export default function SWRConfigContext({ children }: { children: import('react').ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url) => fetch(url).then((res) => res.json()),
        revalidateOnFocus: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
