import React from 'react';

/**
 * Root /manage layout — plain passthrough with no sidebar or admin chrome.
 * The sidebar is applied only inside the (dashboard) route group,
 * which covers all authenticated admin pages but NOT /manage/login.
 */
export default function ManageRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
