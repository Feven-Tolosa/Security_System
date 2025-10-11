import '../globals.css'

import { RequireAuth } from '@/app/providers'
import ManagerSidebar from './components/ManagerSidebar'
import ManagerNavbar from './components/ManagerNavbar'
import ManagerFooter from './components/ManagerFooter'

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col'>
      <RequireAuth allow={['manager']}>
        <ManagerNavbar />
        <div className='flex flex-1 overflow-hidden'>
          <ManagerSidebar />
          <main className='flex-1 p-6 overflow-y-auto'>{children}</main>
        </div>
        <ManagerFooter />
      </RequireAuth>
    </div>
  )
}
