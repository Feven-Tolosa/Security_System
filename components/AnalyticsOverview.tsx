'use client'
import React from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

const threatData = [
  { name: 'Mon', threats: 24, incidents: 10 },
  { name: 'Tue', threats: 18, incidents: 6 },
  { name: 'Wed', threats: 35, incidents: 15 },
  { name: 'Thu', threats: 28, incidents: 12 },
  { name: 'Fri', threats: 40, incidents: 20 },
  { name: 'Sat', threats: 22, incidents: 8 },
  { name: 'Sun', threats: 15, incidents: 5 },
]

const vpnSessions = [
  { region: 'US', sessions: 120 },
  { region: 'EU', sessions: 90 },
  { region: 'Asia', sessions: 150 },
  { region: 'Africa', sessions: 60 },
]

const AnalyticsOverview = () => {
  return (
    <div className='rounded-2xl shadow p-4 bg-white dark:bg-gray-800'>
      {/* <CardContent> */}
      <h2 className='text-lg font-bold text-gray-900 dark:text-white mb-4'>
        Analytics Overview
      </h2>

      {/* Threat Trends */}
      <div className='h-48 mb-6'>
        <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>
          Weekly Threat & Incident Trends
        </h3>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={threatData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#ddd' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Line type='monotone' dataKey='threats' stroke='#ef4444' />
            <Line type='monotone' dataKey='incidents' stroke='#3b82f6' />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* VPN Sessions */}
      <div className='h-48'>
        <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>
          VPN Sessions by Region
        </h3>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={vpnSessions}>
            <CartesianGrid strokeDasharray='3 3' stroke='#ddd' />
            <XAxis dataKey='region' />
            <YAxis />
            <Tooltip />
            <Bar dataKey='sessions' fill='#10b981' radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* </CardContent> */}
    </div>
  )
}

export default AnalyticsOverview
