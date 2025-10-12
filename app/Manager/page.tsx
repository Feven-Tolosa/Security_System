'use client'

import React, { useEffect, useState } from 'react'
import {
  ArrowDownTrayIcon,
  CubeIcon,
  BellAlertIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import { useLanguage } from '@/contexts/LanguageContext'

interface Alert {
  id: number
  type: string
  msg: string
  resolved: boolean
}

interface ActivityLog {
  id: number
  message: string
  time: string
  type: 'info' | 'warning' | 'success'
}

const ManagerDashboardPage = () => {
  const { t } = useLanguage()

  const [stats, setStats] = useState([
    { label: t('manager_ready_download'), value: 24, icon: ArrowDownTrayIcon },
    { label: t('manager_ready_software'), value: 15, icon: CubeIcon },
    { label: t('manager_pending_alerts'), value: 8, icon: BellAlertIcon },
    { label: t('manager_response_rate'), value: '96%', icon: ChartBarIcon },
  ])

  const [alerts, setAlerts] = useState<Alert[]>([])
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([])

  // 🔹 Load from localStorage
  useEffect(() => {
    const storedAlerts = localStorage.getItem('managerAlerts')
    const storedLog = localStorage.getItem('managerActivityLog')

    if (storedAlerts) {
      setAlerts(JSON.parse(storedAlerts))
    } else {
      // Initialize sample alerts
      setAlerts([
        {
          id: 1,
          type: 'Firewall',
          msg: t('manager_alert_firewall'),
          resolved: false,
        },
        {
          id: 2,
          type: 'Access',
          msg: t('manager_alert_access'),
          resolved: false,
        },
        {
          id: 3,
          type: 'Network',
          msg: t('manager_alert_network'),
          resolved: false,
        },
      ])
    }

    if (storedLog) {
      setActivityLog(JSON.parse(storedLog))
    } else {
      addActivityLog(t('manager_system_check'), 'info')
    }
  }, [t])

  // 🔹 Save to localStorage whenever alerts or logs change
  useEffect(() => {
    localStorage.setItem('managerAlerts', JSON.stringify(alerts))
    localStorage.setItem('managerActivityLog', JSON.stringify(activityLog))
  }, [alerts, activityLog])

  // 🔹 Add log entry
  const addActivityLog = (
    message: string,
    type: 'info' | 'warning' | 'success'
  ) => {
    const now = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })

    const newLog = { id: Date.now(), message, time: now, type }
    setActivityLog((prev) => [newLog, ...prev])
  }

  // 🔹 Mark alert as resolved
  const resolveAlert = (id: number) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, resolved: true } : alert
      )
    )
    const alert = alerts.find((a) => a.id === id)
    if (alert) {
      addActivityLog(`${alert.type} ${t('manager_alert_resolved')}`, 'success')
    }
  }

  // 🔹 Simulate system update (new alert every 20 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const newAlert: Alert = {
        id: Date.now(),
        type: 'System',
        msg: t('manager_alert_new_issue'),
        resolved: false,
      }
      setAlerts((prev) => [newAlert, ...prev])
      addActivityLog(t('manager_new_alert_logged'), 'warning')
    }, 20000)

    return () => clearInterval(interval)
  }, [t])

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

      {/* Stats */}
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

      {/* Alerts */}
      <section className='bg-white/10 dark:bg-gray-900/60 p-6 rounded-2xl shadow-lg mb-10'>
        <h2 className='text-xl font-semibold text-primary mb-4'>
          {t('manager_recent_alerts')}
        </h2>
        {alerts.length === 0 ? (
          <p className='text-gray-400'>{t('manager_no_alerts')} 🎉</p>
        ) : (
          <div className='space-y-3'>
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center justify-between gap-3 p-4 rounded-xl transition ${
                  alert.resolved ? 'bg-green-800/40' : 'bg-gray-800/40'
                }`}
              >
                <div className='flex items-center gap-3'>
                  <ExclamationCircleIcon
                    className={`h-5 w-5 ${
                      alert.resolved ? 'text-green-400' : 'text-yellow-500'
                    }`}
                  />
                  <div>
                    <p className='text-sm font-medium text-white'>
                      {alert.type}
                    </p>
                    <p className='text-xs text-gray-400'>{alert.msg}</p>
                  </div>
                </div>
                {!alert.resolved && (
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className='text-sm bg-primary/20 hover:bg-primary/40 text-primary px-3 py-1 rounded-lg transition'
                  >
                    {t('manager_mark_resolved')}
                  </button>
                )}
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
              className={`flex items-center gap-3 p-3 rounded-xl ${
                log.type === 'success'
                  ? 'bg-green-800/30'
                  : log.type === 'warning'
                  ? 'bg-yellow-800/30'
                  : 'bg-gray-800/40'
              }`}
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
