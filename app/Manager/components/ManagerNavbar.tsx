'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import logo from '@/public/image/logo.png'
import { useLanguage } from '@/contexts/LanguageContext'
import { ManagerProfile } from './ManagerProfileSettings'

export default function ManagerNavbar() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { language, toggleLanguage, t } = useLanguage()

  const [profile, setProfile] = useState<ManagerProfile | null>(null)

  // 🔹 Load manager profile from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('manager-profile')
    if (stored) {
      setProfile(JSON.parse(stored))
    }
  }, [])

  return (
    <header
      className='fixed top-0 left-0 right-0 z-50 flex items-center justify-between 
                 px-6 py-3 bg-secondary dark:bg-gray-900 
                 border-b border-gray-700 shadow-md backdrop-blur-lg'
    >
      {/* Left Side - Logo and Title */}
      <div className='flex items-center gap-3'>
        <Link href='/'>
          <Image src={logo} alt='Logo' width={55} height={55} />
        </Link>
        <h1 className='text-lg font-semibold text-white'>
          {t('manager_dashboard_title')}
        </h1>
      </div>

      {/* Right Side Controls */}
      <div className='flex items-center gap-3'>
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className='p-2 rounded-md border border-gray-500/50 
                     text-xs text-white hover:bg-gray-700 transition'
          aria-label='Toggle language'
          title={`Switch to ${language === 'en' ? 'Amharic' : 'English'}`}
        >
          {language === 'en' ? 'AM' : 'EN'}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className='p-2 rounded-md hover:bg-gray-700 text-white transition'
          title={t('toggle_theme')}
        >
          {theme === 'dark' ? (
            <SunIcon className='h-5 w-5 text-yellow-400' />
          ) : (
            <MoonIcon className='h-5 w-5 text-gray-200' />
          )}
        </button>

        {/* Settings */}
        <Link
          href='/Manager/settings'
          className='bg-[var(--color-primary)] text-white px-4 py-2 rounded-md 
                     shadow hover:bg-opacity-80 transition font-medium'
        >
          {t('settings')}
        </Link>

        {/* Profile Picture / Initial */}
        <Link
          href='/Manager/settings'
          className='relative group'
          title={t('profile')}
        >
          {profile?.avatar ? (
            <img
              src={profile.avatar}
              alt='Manager Avatar'
              className='w-10 h-10 rounded-full border-2 border-primary shadow-md hover:shadow-primary/40 transition-all duration-300'
            />
          ) : (
            <div
              className='w-10 h-10 rounded-full bg-primary flex items-center justify-center 
                         text-white font-bold border border-primary/40 shadow-md'
            >
              {profile?.name?.charAt(0).toUpperCase() || 'M'}
            </div>
          )}
          <span
            className='absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 
                       text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 
                       transition whitespace-nowrap'
          >
            {profile?.name || t('manager_profile')}
          </span>
        </Link>

        {/* Logout */}
        <button
          onClick={() => router.push('/')}
          className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 
                     transition font-medium'
        >
          {t('logout')}
        </button>
      </div>
    </header>
  )
}
