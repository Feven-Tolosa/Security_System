'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import logo from '@/public/image/logo.png'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ManagerNavbar() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { language, toggleLanguage, t } = useLanguage()

  return (
    <header
      className='flex items-center justify-between px-6 py-3 
      bg-secondary dark:bg-gray-900 border-b border-gray-700 shadow-md'
    >
      {/* Left Side - Logo and Title */}
      <div className='flex items-center gap-3'>
        <Image src={logo} alt='Logo' width={50} height={50} />
        <h1 className='text-lg font-semibold text-white'>
          {t('manager_dashboard')}
        </h1>
      </div>

      {/* Right Side - Controls */}
      <div className='flex items-center gap-3'>
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className='p-2 rounded-md border border-gray-300 dark:border-gray-700 
          text-xs text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition'
          aria-label='Toggle language'
          title={`Switch to ${language === 'en' ? 'Amharic' : 'English'}`}
        >
          {language === 'en' ? 'AM' : 'EN'}
        </button>

        {/* Settings */}
        <Link
          href='/Manager/settings'
          className='bg-[var(--color-primary)] text-white px-4 py-2 rounded-md 
          shadow hover:bg-opacity-80 transition font-medium'
        >
          {t('settings')}
        </Link>

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
