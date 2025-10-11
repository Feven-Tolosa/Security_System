'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import logo from '@/public/image/logo.png'

export default function ManagerNavbar() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  return (
    <header className='flex items-center justify-between px-6 py-3 bg-secondary dark:bg-gray-800 border-b border-gray-700'>
      <div className='flex items-center gap-3'>
        <Image src={logo} alt='Logo' width={50} height={50} />
        <h1 className='text-lg font-semibold text-white'>Manager Dashboard</h1>
      </div>

      <div className='flex items-center gap-4'>
        <Link
          href='/Manager/settings'
          className='bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-opacity-80 transition'
        >
          Settings
        </Link>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className='p-2 rounded-md hover:bg-gray-700 text-white'
          title='Toggle theme'
        >
          {theme === 'dark' ? (
            <SunIcon className='h-5 w-5 text-yellow-400' />
          ) : (
            <MoonIcon className='h-5 w-5 text-gray-200' />
          )}
        </button>

        <button
          onClick={() => router.push('/')}
          className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition'
        >
          Logout
        </button>
      </div>
    </header>
  )
}
