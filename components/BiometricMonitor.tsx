'use client'
import React, { useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'
import { CheckCircle, XCircle } from 'lucide-react'

type BiometricEvent = {
  type: string
  status: 'Success' | 'Failed'
}

const initialEvents: BiometricEvent[] = [
  { type: 'Fingerprint', status: 'Success' },
  { type: 'Facial Recognition', status: 'Failed' },
  { type: 'Iris Scan', status: 'Success' },
]

export default function BiometricMonitor() {
  const [events] = useState<BiometricEvent[]>(initialEvents)

  // prepare chart data: count Success vs Failed
  const statusCounts = [
    {
      status: 'Success',
      count: events.filter((e) => e.status === 'Success').length,
    },
    {
      status: 'Failed',
      count: events.filter((e) => e.status === 'Failed').length,
    },
  ]

  return (
    <div className='bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md space-y-4'>
      <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-2'>
        Biometric Identity Protection
      </h2>

      {/* Event list */}
      <ul className='space-y-2'>
        {events.map((b, idx) => (
          <li
            key={idx}
            className={`flex justify-between items-center p-3 rounded-lg ${
              b.status === 'Success'
                ? 'bg-gray-900 text-green-900 dark:text-white'
                : 'bg-gray-900 text-red-900 dark:text-white'
            }`}
          >
            <span className='flex items-center gap-2'>
              {b.status === 'Success' ? (
                <CheckCircle className='w-5 h-5 text-green-600 dark:text-green-300' />
              ) : (
                <XCircle className='w-5 h-5 text-red-600 dark:text-red-300' />
              )}
              {b.type}
            </span>
            <span className='font-semibold'>{b.status}</span>
          </li>
        ))}
      </ul>

      {/* Status Chart */}
      <div className='bg-gray-50 dark:bg-gray-900 p-4 rounded-xl'>
        <h3 className='text-md font-semibold mb-2 text-gray-800 dark:text-white'>
          Status Overview
        </h3>
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <BarChart data={statusCounts}>
              <XAxis dataKey='status' />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey='count' fill='#4CAF50' name='Attempts' />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
