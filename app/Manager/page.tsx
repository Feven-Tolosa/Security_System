'use client'

import {
  ShieldCheckIcon,
  EnvelopeIcon,
  ChartBarIcon,
  BellAlertIcon,
  ArrowDownTrayIcon,
  CubeIcon,
} from '@heroicons/react/24/outline'

export default function ManagerDashboardPage() {
  const stats = [
    { label: 'Ready to Download', value: 24, icon: ArrowDownTrayIcon },
    { label: 'Ready-to-Use Software', value: 15, icon: CubeIcon },
    { label: 'Pending Alerts', value: 8, icon: BellAlertIcon },
    { label: 'Response Rate', value: '96%', icon: ChartBarIcon },
  ]

  const alerts = [
    { type: 'Firewall', msg: 'Blocked suspicious IP from 192.168.1.27' },
    { type: 'Access', msg: 'Unauthorized login attempt detected' },
    { type: 'Network', msg: 'Unusual data spike detected on port 443' },
  ]

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-secondary dark:text-primary mb-2'>
          Manager Dashboard
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Overview of system activity and downloads.
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6'>
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className='bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4 hover:shadow-xl transition'
          >
            <div className='bg-primary/20 dark:bg-primary/30 p-3 rounded-xl'>
              <Icon className='h-6 w-6 text-primary' />
            </div>
            <div>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                {label}
              </p>
              <p className='text-2xl font-bold'>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Security Alerts */}
      <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700'>
        <h2 className='text-xl font-semibold text-primary mb-4'>
          Recent Security Alerts
        </h2>
        <ul className='space-y-3'>
          {alerts.map(({ type, msg }, i) => (
            <li
              key={i}
              className='border-l-4 border-primary pl-4 py-2 bg-gray-50 dark:bg-gray-900/30 rounded'
            >
              <p className='text-sm font-medium text-gray-700 dark:text-gray-200'>
                {type} Alert
              </p>
              <p className='text-gray-500 dark:text-gray-400'>{msg}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
