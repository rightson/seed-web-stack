'use client';

import { ReactNode, useMemo } from 'react';
import { RelayEnvironmentProvider } from 'react-relay';
import { getEnvironment } from '../../../lib/relay/environment';

export function Providers({ children }: { children: ReactNode }) {
  const environment = useMemo(() => getEnvironment(), []);

  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
}
