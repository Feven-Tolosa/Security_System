'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const AdminFooter = () => {
  // Mock: system online status (later can fetch from API)
  const [isOnline, setIsOnline] = useState(true)

  // Example: simulate a status check every 10s (replace with real API later)
  useEffect(() => {
    const interval = setInterval(() => {
      // For demo: randomize status
      setIsOnline(Math.random() > 0.2) // 80% online
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className='w-full bg-gray-900 text-gray-300 py-6 border-t border-gray-700 mb-0'>
      <div className='max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm'>
        {/* Left: Info */}
        <div className='text-center md:text-left'>
          <p className='font-medium text-primary'>
            Admin Panel – Security System
          </p>
          <p className='text-gray-400'>Version 1.0.0</p>
        </div>

        {/* Middle: Quick Links */}
        <div className='flex gap-6'>
          <Link href='/Admin' className='hover:text-primary transition-colors'>
            Dashboard
          </Link>
          {/* <Link
            href='/Admin/users'
            className='hover:text-primary transition-colors'
          >
            Users
          </Link> */}
          <Link
            href='/Admin/requests'
            className='hover:text-primary transition-colors'
          >
            Requests
          </Link>
          <Link
            href='/Admin/reports'
            className='hover:text-primary transition-colors'
          >
            Reports
          </Link>
        </div>

        {/* Right: Status + Copyright */}
        <div className='flex items-center gap-4'>
          {/* Status indicator */}
          <div className='flex items-center gap-2'>
            <span
              className={`h-3 w-3 rounded-full ${
                isOnline ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className='text-xs'>
              {isOnline ? 'System Online' : 'System Offline'}
            </span>
          </div>

          <div className='text-gray-500 text-xs'>
            © {new Date().getFullYear()} SecureSystem Admin
          </div>
        </div>
      </div>
    </footer>
  )
}

export default AdminFooter
