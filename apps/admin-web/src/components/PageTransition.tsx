import type { ReactNode } from 'react';

export function PageTransition({ routeKey, children }: { routeKey: string; children: ReactNode }) {
  return (
    <div data-route={routeKey} className="page-transition">
      {children}
    </div>
  );
}
