import type { Metadata } from 'next'
import ManagerAuthWrapper from './ManagerAuthWrapper'

export const metadata: Metadata = {
  title: 'Manager – Secure Systems',
}

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ManagerAuthWrapper>{children}</ManagerAuthWrapper>
}
