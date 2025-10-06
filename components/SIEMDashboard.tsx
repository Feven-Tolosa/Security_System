'use client'
import React, { useEffect, useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import {
  CheckCircleIcon,
  XCircleIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'

// TYPES
type Incident = {
  id: number
  type: string
  count: number
}

type Request = {
  id: number
  fullName: string
  email: string
  status: 'Pending' | 'Approved' | 'Completed'
  downloadLink?: string | null
}

// COLORS for charts
const COLORS = ['#FF4C4C', '#FFA500', '#4CAF50']

export default function SIEMDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incRes, reqRes] = await Promise.all([
          fetch('/api/siem/incidents'),
          fetch('/api/siem/requests'),
        ])

        const incidentsData = await incRes.json()
        const requestsData = await reqRes.json()

        setIncidents(incidentsData)
        setRequests(requestsData)
      } catch (err) {
        console.error('Error fetching SIEM data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Update incident count
  const updateCount = async (incident: Incident, delta: number) => {
    const newCount = Math.max(0, incident.count + delta)

    // Optimistic UI update
    setIncidents((prev) =>
      prev.map((it) =>
        it.id === incident.id ? { ...it, count: newCount } : it
      )
    )

    await fetch('/api/siem/incidents', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: incident.id, count: newCount }),
    })
  }

  // Approve a request
  const handleApprove = async (req: Request) => {
    const updated: Request = { ...req, status: 'Approved' }
    setRequests((prev) => prev.map((r) => (r.id === req.id ? updated : r)))

    await fetch('/api/siem/requests', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
  }

  // Complete request with license link
  const handleComplete = async (req: Request) => {
    const link = prompt('Enter license or installer download link:')
    if (!link) return

    const updated: Request = {
      ...req,
      status: 'Completed',
      downloadLink: link,
    }

    setRequests((prev) => prev.map((r) => (r.id === req.id ? updated : r)))

    await fetch('/api/siem/requests', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
  }

  if (loading) return <p className='text-gray-500'>Loading SIEM data...</p>

  // Chart data
  const pieData = incidents.map((it) => ({ name: it.type, value: it.count }))

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const areaData = days.map((day, idx) => ({
    day,
    ...incidents.reduce((acc, it) => {
      const key = it.type.replace(/\s+/g, '_')
      acc[key] = Math.max(0, it.count - idx) // fake trend for demo
      return acc
    }, {} as Record<string, number>),
  }))

  return (
    <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md space-y-8'>
      <h2 className='text-xl font-bold text-gray-800 dark:text-white mb-4'>
        Nisir SIEM Manager Dashboard
      </h2>

      {/* INCIDENT LIST */}
      <section>
        <h3 className='text-md font-semibold mb-3'>Incidents</h3>
        <ul className='space-y-2'>
          {incidents.map((it) => (
            <li
              key={it.id}
              className='flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-900'
            >
              <span className='font-medium'>{it.type}</span>
              <div className='flex items-center space-x-2'>
                <button
                  onClick={() => updateCount(it, -1)}
                  disabled={it.count <= 0}
                  className='px-2 py-1 bg-gray-700 text-white rounded disabled:opacity-40'
                >
                  -
                </button>
                <span className='font-semibold'>{it.count}</span>
                <button
                  onClick={() => updateCount(it, 1)}
                  className='px-2 py-1 bg-gray-700 text-white rounded'
                >
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* CHARTS */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Pie Chart */}
        <div className='bg-gray-50 dark:bg-gray-900 p-4 rounded-xl'>
          <h3 className='text-md font-semibold mb-2'>Incident Types</h3>
          <ResponsiveContainer width='100%' height={240}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey='value'
                nameKey='name'
                cx='50%'
                cy='50%'
                outerRadius={80}
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Area Chart */}
        <div className='bg-gray-50 dark:bg-gray-900 p-4 rounded-xl'>
          <h3 className='text-md font-semibold mb-2'>
            Incident Trends (Past Week)
          </h3>
          <ResponsiveContainer width='100%' height={240}>
            <AreaChart data={areaData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='day' />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(areaData[0] ?? {})
                .filter((k) => k !== 'day')
                .map((key, i) => (
                  <Area
                    key={key}
                    type='monotone'
                    dataKey={key}
                    stackId='1'
                    stroke={COLORS[i % COLORS.length]}
                    fill={COLORS[i % COLORS.length] + '33'}
                  />
                ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* REQUESTS SECTION */}
      <section>
        <h3 className='text-md font-semibold mb-3'>User Requests</h3>
        {requests.length === 0 ? (
          <p className='text-gray-500'>No requests yet.</p>
        ) : (
          <div className='space-y-3'>
            {requests.map((req) => (
              <div
                key={req.id}
                className='flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-900'
              >
                <div>
                  <p className='font-medium text-white'>{req.fullName}</p>
                  <p className='text-sm text-gray-400'>{req.email}</p>
                  <p className='text-xs text-gray-500'>
                    Status: <span className='font-semibold'>{req.status}</span>
                  </p>
                  {req.downloadLink && (
                    <a
                      href={req.downloadLink}
                      target='_blank'
                      className='flex items-center gap-1 text-blue-400 text-sm mt-1'
                    >
                      <LinkIcon className='h-4 w-4' /> Download
                    </a>
                  )}
                </div>
                <div className='flex gap-2'>
                  {req.status === 'Pending' && (
                    <button
                      onClick={() => handleApprove(req)}
                      className='flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm'
                    >
                      <CheckCircleIcon className='h-4 w-4' /> Approve
                    </button>
                  )}
                  {req.status === 'Approved' && (
                    <button
                      onClick={() => handleComplete(req)}
                      className='flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm'
                    >
                      <CheckCircleIcon className='h-4 w-4' /> Complete
                    </button>
                  )}
                  {req.status === 'Completed' && (
                    <span className='text-green-500 font-medium'>✔ Done</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
