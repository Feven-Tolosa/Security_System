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
import { motion, AnimatePresence } from 'framer-motion'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts'

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
    { label: t('manager_response_rate'), value: 96, icon: ChartBarIcon },
  ])

  const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']

  const activityTrend = [
    { name: 'Mon', alerts: 2, resolved: 3 },
    { name: 'Tue', alerts: 3, resolved: 1 },
    { name: 'Wed', alerts: 5, resolved: 4 },
    { name: 'Thu', alerts: 4, resolved: 5 },
    { name: 'Fri', alerts: 6, resolved: 4 },
    { name: 'Sat', alerts: 3, resolved: 5 },
    { name: 'Sun', alerts: 2, resolved: 2 },
  ]

  useEffect(() => {
    const storedAlerts = localStorage.getItem('managerAlerts')
    const storedLog = localStorage.getItem('managerActivityLog')

    if (storedAlerts) setAlerts(JSON.parse(storedAlerts))
    else {
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

    if (storedLog) setActivityLog(JSON.parse(storedLog))
    else addActivityLog(t('manager_system_check'), 'info')
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
      >
        <h1 className='text-4xl font-bold text-primary tracking-tight'>
          {t('manager_dashboard_title')}
        </h1>
        <p className='text-gray-500 dark:text-gray-400'>
          {t('manager_dashboard_subtitle')}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10'>
        {stats.map(({ label, value, icon: Icon }, i) => (
          <motion.div
            key={label}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 120 }}
            className={`p-6 rounded-2xl text-center backdrop-blur-md shadow-lg border ${
              isDark
                ? 'bg-gray-900/50 border-gray-700'
                : 'bg-white/70 border-gray-200'
            }`}
          >
            <Icon className='h-10 w-10 mx-auto mb-3 text-primary' />
            <h3 className='text-sm text-gray-400'>{label}</h3>
            <p className='text-3xl font-semibold text-primary'>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-2xl shadow-lg border ${
            isDark
              ? 'bg-gray-900/70 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <h2 className='text-xl font-semibold mb-4 text-primary'>
            {t('manager_alert_distribution')}
          </h2>
          <ResponsiveContainer width='100%' height={260}>
            <PieChart>
              <defs>
                <linearGradient id='pieGradient' x1='0' y1='0' x2='1' y2='1'>
                  <stop offset='0%' stopColor='#3b82f6' />
                  <stop offset='100%' stopColor='#22c55e' />
                </linearGradient>
              </defs>
              <Pie
                data={stats}
                dataKey='value'
                nameKey='label'
                outerRadius={110}
                innerRadius={60}
                fill='url(#pieGradient)'
                label
                isAnimationActive
              >
                {stats.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#fff',
                  borderRadius: 12,
                  border: 'none',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-2xl shadow-lg border ${
            isDark
              ? 'bg-gray-900/70 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <h2 className='text-xl font-semibold mb-4 text-primary'>
            {t('manager_weekly_trend')}
          </h2>
          <ResponsiveContainer width='100%' height={260}>
            <LineChart data={activityTrend}>
              <defs>
                <linearGradient id='alertsGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='#ef4444' stopOpacity={0.9} />
                  <stop offset='100%' stopColor='#ef4444' stopOpacity={0.1} />
                </linearGradient>
                <linearGradient
                  id='resolvedGradient'
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop offset='0%' stopColor='#22c55e' stopOpacity={0.9} />
                  <stop offset='100%' stopColor='#22c55e' stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray='3 3'
                stroke={isDark ? '#374151' : '#e5e7eb'}
              />
              <XAxis dataKey='name' stroke={isDark ? '#9ca3af' : '#4b5563'} />
              <YAxis stroke={isDark ? '#9ca3af' : '#4b5563'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#fff',
                  borderRadius: 12,
                  border: 'none',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                }}
              />
              <Legend />
              <Line
                type='monotone'
                dataKey='alerts'
                stroke='url(#alertsGradient)'
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
              <Line
                type='monotone'
                dataKey='resolved'
                stroke='url(#resolvedGradient)'
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </main>
  )
}

export default ManagerDashboardPage
