'use client'

import React, { useEffect, useState } from 'react'
import {
  ArrowDownTrayIcon,
  CubeIcon,
  BellAlertIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'
import { useLanguage } from '@/contexts/LanguageContext'

const ManagerDashboardPage = () => {
  const { t } = useLanguage()

  const [activityLog, setActivityLog] = useState(() => {
    const stored = localStorage.getItem('managerActivityLog')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }
    return []
  })

  const stats = [
    { label: t('manager_ready_download'), value: 24, icon: ArrowDownTrayIcon },
    { label: t('manager_ready_software'), value: 15, icon: CubeIcon },
    { label: t('manager_pending_alerts'), value: 8, icon: BellAlertIcon },
    { label: t('manager_response_rate'), value: '96%', icon: ChartBarIcon },
  ]

  const alerts = [
    { type: 'Firewall', msg: t('manager_alert_firewall') },
    { type: 'Access', msg: t('manager_alert_access') },
    { type: 'Network', msg: t('manager_alert_network') },
  ]

  // Add demo log for first time
  useEffect(() => {
    if (activityLog.length === 0) {
      const now = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      setActivityLog([
        {
          id: Date.now(),
          message: t('manager_system_check'),
          time: now,
          type: 'info',
        },
      ])
    }
  }, [activityLog.length, t])

  useEffect(() => {
    localStorage.setItem('managerActivityLog', JSON.stringify(activityLog))
  }, [activityLog])

  return (
    <main className='pt-12 pb-16 px-6 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='mb-10 text-center'>
        <h1 className='text-4xl font-bold text-primary'>
          {t('manager_dashboard_title')}
        </h1>
        <p className='text-gray-500 dark:text-gray-400'>
          {t('manager_dashboard_subtitle')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10'>
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className='bg-white/10 dark:bg-gray-900/60 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition'
          >
            <div className='flex justify-center mb-3'>
              <Icon className='h-10 w-10 text-primary' />
            </div>
            <h3 className='text-lg font-medium text-gray-400 dark:text-gray-300'>
              {label}
            </h3>
            <p className='text-3xl font-bold text-white'>{value}</p>
          </div>
        ))}
      </div>

      {/* Security Alerts */}
      <section className='bg-white/10 dark:bg-gray-900/60 p-6 rounded-2xl shadow-lg mb-10'>
        <h2 className='text-xl font-semibold text-primary mb-4'>
          {t('manager_recent_alerts')}
        </h2>
        {alerts.length === 0 ? (
          <p className='text-gray-400'>{t('manager_no_alerts')} 🎉</p>
        ) : (
          <div className='space-y-3'>
            {alerts.map(({ type, msg }, i) => (
              <div
                key={i}
                className='flex items-center gap-3 bg-gray-800/40 p-4 rounded-xl'
              >
                <ExclamationCircleIcon className='h-5 w-5 text-yellow-500' />
                <div>
                  <p className='text-sm font-medium text-white'>{type}</p>
                  <p className='text-xs text-gray-400'>{msg}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Activity Logs */}
      <section className='bg-white/10 dark:bg-gray-900/60 p-6 rounded-2xl shadow-lg'>
        <h2 className='text-xl font-semibold text-primary mb-4'>
          {t('manager_recent_activity')}
        </h2>
        <div className='space-y-3'>
          {activityLog.map((log) => (
            <div
              key={log.id}
              className='flex items-center gap-3 bg-gray-800/40 p-3 rounded-xl'
            >
              <ShieldCheckIcon className='h-5 w-5 text-blue-500' />
              <div>
                <p className='text-sm font-medium text-white'>{log.message}</p>
                <p className='text-xs text-gray-400'>{log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default ManagerDashboardPage
