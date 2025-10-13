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
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion' // 👈 for animations

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
  const { theme } = useTheme()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([])

  const [stats, setStats] = useState([
    { label: t('manager_ready_download'), value: 24, icon: ArrowDownTrayIcon },
    { label: t('manager_ready_software'), value: 15, icon: CubeIcon },
    { label: t('manager_pending_alerts'), value: 8, icon: BellAlertIcon },
    { label: t('manager_response_rate'), value: '96%', icon: ChartBarIcon },
  ])

  // Load and save logic...
  useEffect(() => {
    const storedAlerts = localStorage.getItem('managerAlerts')
    const storedLog = localStorage.getItem('managerActivityLog')

    if (storedAlerts) {
      setAlerts(JSON.parse(storedAlerts))
    } else {
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

  useEffect(() => {
    localStorage.setItem('managerAlerts', JSON.stringify(alerts))
    localStorage.setItem('managerActivityLog', JSON.stringify(activityLog))
  }, [alerts, activityLog])

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

  const resolveAlert = (id: number) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, resolved: true } : alert
      )
    )
    const alert = alerts.find((a) => a.id === id)
    if (alert)
      addActivityLog(`${alert.type} ${t('manager_alert_resolved')}`, 'success')
  }

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

  const isDark = theme === 'dark'

  return (
    <main
      className={`pt-24 pb-16 px-6 max-w-7xl mx-auto transition-colors duration-500 ${
        isDark ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-900'
      }`}
    >
      {/* Header */}
      <motion.div
        className='mb-10 text-center'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className='text-4xl font-bold text-primary shadow-black drop-shadow-lg'>
          {t('manager_dashboard_title')}
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          {t('manager_dashboard_subtitle')}
        </p>
      </motion.div>

      {/* Stats Section */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10'>
        {stats.map(({ label, value, icon: Icon }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
            whileHover={{
              y: -5,
              boxShadow: isDark
                ? '0px 8px 20px rgba(0, 0, 0, 0.6)'
                : '0px 8px 20px rgba(0, 0, 0, 0.15)',
            }}
            className={`p-6 rounded-2xl text-center cursor-pointer transform transition-all duration-300 ${
              isDark
                ? 'bg-gray-900/60 shadow-lg shadow-gray-800/40'
                : 'bg-white/90 shadow-md shadow-gray-300/50'
            }`}
          >
            <div className='flex justify-center mb-3'>
              <Icon className='h-10 w-10 text-primary drop-shadow-md' />
            </div>
            <h3 className='text-lg font-medium text-gray-400 dark:text-gray-300'>
              {label}
            </h3>
            <p className='text-3xl font-bold text-white dark:text-white'>
              {value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Alerts Section */}
      <motion.section
        className={`p-6 rounded-2xl shadow-lg mb-10 ${
          isDark ? 'bg-gray-900/60' : 'bg-white/90'
        }`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className='text-xl font-semibold text-primary mb-4'>
          {t('manager_recent_alerts')}
        </h2>
        <AnimatePresence>
          {alerts.length === 0 ? (
            <p className='text-gray-400'>{t('manager_no_alerts')} 🎉</p>
          ) : (
            alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center justify-between gap-3 p-4 mb-3 rounded-xl transition ${
                  alert.resolved
                    ? 'bg-green-800/40 shadow-lg shadow-green-700/30'
                    : 'bg-gray-800/40 hover:shadow-lg hover:shadow-yellow-600/20'
                }`}
              >
                <div className='flex items-center gap-3'>
                  <ExclamationCircleIcon
                    className={`h-5 w-5 ${
                      alert.resolved ? 'text-green-400' : 'text-yellow-500'
                    }`}
                  />
                  <div>
                    <p className='text-sm font-medium'>{alert.type}</p>
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
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.section>

      {/* Activity Logs */}
      <motion.section
        className={`p-6 rounded-2xl  shadow-lg ${
          isDark ? 'bg-gray-900/60' : 'bg-white/90'
        }`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className='text-xl font-semibold text-primary mb-4'>
          {t('manager_recent_activity')}
        </h2>
        <div className='space-y-3'>
          <AnimatePresence>
            {activityLog.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: isDark
                    ? '0px 8px 18px rgba(0,0,0,0.6)'
                    : '0px 8px 18px rgba(0,0,0,0.1)',
                }}
                className={`flex items-center mb-3 gap-3 p-3 rounded-xl transition ${
                  log.type === 'success'
                    ? 'bg-green-800/30'
                    : log.type === 'warning'
                    ? 'bg-yellow-800/30'
                    : 'bg-gray-800/40'
                }`}
              >
                <ShieldCheckIcon className='h-5 w-5 text-blue-500' />
                <div>
                  <p className='text-sm font-medium'>{log.message}</p>
                  <p className='text-xs text-gray-400'>{log.time}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.section>
    </main>
  )
}

export default ManagerDashboardPage
