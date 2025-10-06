'use client'
import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts'

const threatsData = [
  { day: 'Mon', threats: 5 },
  { day: 'Tue', threats: 8 },
  { day: 'Wed', threats: 3 },
  { day: 'Thu', threats: 10 },
  { day: 'Fri', threats: 6 },
  { day: 'Sat', threats: 4 },
  { day: 'Sun', threats: 7 },
]

const vpnData = [
  { region: 'US', sessions: 120 },
  { region: 'EU', sessions: 95 },
  { region: 'Asia', sessions: 150 },
  { region: 'Africa', sessions: 60 },
]

export default function AnalyticsOverview() {
  return (
    <div className='grid md:grid-cols-2 gap-6'>
      {/* Line Chart - Threats over week */}
      <div className='bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-4'>
          Threats / Incidents Over Week
        </h2>
        <ResponsiveContainer width='100%' height={250}>
          <LineChart data={threatsData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='day' stroke='#8884d8' />
            <YAxis />
            <Tooltip />
            <Line
              type='monotone'
              dataKey='threats'
              stroke='#8884d8'
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - VPN sessions by region */}
      <div className='bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-4'>
          VPN Sessions by Region
        </h2>
        <ResponsiveContainer width='100%' height={250}>
          <BarChart data={vpnData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='region' stroke='#8884d8' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='sessions' fill='#82ca9d' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
