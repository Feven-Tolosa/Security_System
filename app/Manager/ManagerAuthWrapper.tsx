'use client'

import { RequireAuth } from '@/app/providers'

export default function ManagerAuthWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <RequireAuth allow={['manager']}>{children}</RequireAuth>
}
