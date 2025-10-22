'use client'

import React, { useState, useEffect } from 'react'
import { Bars3Icon, MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../public/image/logo.png'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/app/providers'
import { useLanguage } from '@/contexts/LanguageContext'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const { user, loginWithCredentials, logout } = useAuth()
  const { language, toggleLanguage, t } = useLanguage()

  // State for notification
  const [notification, setNotification] = useState<{
    message: string
    type: 'error' | 'success'
  } | null>(null)

  useEffect(() => {
    setIsLoaded(true)

    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check authorization for protected routes
  const normalizedPathname = pathname ? pathname.toLowerCase() : ''
  const protectedRoutes = ['/admin', '/manager']
  const currentRouteRole = normalizedPathname.slice(1)
  const isUnauthorized =
    protectedRoutes.includes(normalizedPathname) &&
    (!user || user.role.toLowerCase() !== currentRouteRole)

  if (!isLoaded) {
    return (
      <div className='fixed inset-0 z-50 bg-gray-900 flex items-center justify-center text-white'>
        Loading...
      </div>
    )
  }

  if (isUnauthorized) {
    return (
      <div className='fixed inset-0 z-50 bg-gray-900 flex flex-col items-center justify-center text-white'>
        <h1 className='text-6xl font-bold mb-4'>404</h1>
        <p className='text-xl mb-6'>Unauthorized Access</p>
        <p className='text-gray-400 mb-8'>
          You do not have permission to access this page. Please log in with the
          correct credentials.
        </p>
        <Link
          href='/'
          className='bg-primary text-white px-6 py-3 rounded-lg shadow-md hover:bg-secondary transition'
        >
          Back to Home
        </Link>
      </div>
    )
  }

  const handleLogin = async () => {
    if (!email || !password) {
      setNotification({ message: 'Please fill in all fields.', type: 'error' })
      setTimeout(() => setNotification(null), 3000)
      return
    }

    try {
      const { role } = await loginWithCredentials(email, password)
      setLoginModalOpen(false)
      setEmail('')
      setPassword('')
      router.push(
        role === 'admin' ? '/Admin' : role === 'manager' ? '/Manager' : '/'
      )
    } catch (e: unknown) {
      if (e instanceof Error) {
        setNotification({ message: e.message, type: 'error' })
      } else {
        setNotification({ message: 'Login failed', type: 'error' })
      }
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    logout()
    setEmail('')
    setPassword('')
    router.push('/')
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-md' : ''
      }`}
    >
      <nav className='max-w-7xl mx-auto flex items-center justify-between p-3 lg:px-8'>
        <Link href='/' className='flex items-center'>
          <Image src={logo} alt='Logo' className='h-28 w-28 mr-2' />
        </Link>

        <div className='hidden lg:flex lg:items-center lg:gap-8'>
          <div className='flex gap-8 items-center'>
            {[
              { name: t('nav_gasha'), href: '/Gasha' },
              { name: t('nav_nisir'), href: '/Nisir' },
              { name: t('nav_enyuma'), href: '/Enyuma_IAM' },
              { name: t('nav_code_protection'), href: '/Code_Protection' },
              { name: t('nav_biometrics'), href: '/Biometrics' },
              { name: t('nav_contact_us'), href: '/Contact_us' },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className='text-sm font-medium dark:text-gray-100 text-primary hover:text-gray-100 dark:hover:text-primary'
              >
                {item.name}
              </Link>
            ))}

            {!user ? (
              <button
                onClick={() => setLoginModalOpen(true)}
                className='text-sm font-medium dark:text-gray-100 text-primary hover:text-gray-100 dark:hover:text-primary'
              >
                {t('nav_login')}
              </button>
            ) : (
              <div className='flex items-center gap-4'>
                <Link
                  href={`/${
                    user.role === 'admin'
                      ? 'Admin'
                      : user.role === 'manager'
                      ? 'Manager'
                      : ''
                  }`}
                  className='text-sm font-semibold px-3 py-1 rounded bg-primary text-white shadow-md hover:shadow-lg transition'
                >
                  {user.role === 'admin'
                    ? t('nav_role_admin')
                    : user.role === 'manager'
                    ? t('nav_role_manager')
                    : user.role}
                </Link>
                <button
                  onClick={handleLogout}
                  className='text-sm font-medium text-red-500 hover:text-red-700'
                >
                  {t('nav_logout')}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={toggleLanguage}
            className='p-2 rounded-md border border-gray-300 dark:border-gray-700 text-xs mr-2 hover:bg-gray-100 dark:hover:bg-gray-800'
            aria-label='Toggle language'
            title={`Switch to ${language === 'en' ? 'Amharic' : 'English'}`}
          >
            {language === 'en' ? 'AM' : 'EN'}
          </button>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
            aria-label={t('aria_toggle_theme')}
          >
            {theme === 'dark' ? (
              <SunIcon className='h-5 w-5 text-yellow-300' />
            ) : (
              <MoonIcon className='h-5 w-5 text-gray-200' />
            )}
          </button>
        </div>

        <button
          type='button'
          className='lg:hidden p-2 rounded-md text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary'
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-expanded={mobileMenuOpen}
          aria-label='Open menu'
        >
          <Bars3Icon className='h-6 w-6' />
        </button>
      </nav>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className='lg:hidden bg-white/90 dark:bg-gray-900/80 backdrop-blur border-t border-gray-200 dark:border-gray-800'>
          <div className='px-4 py-3 space-y-3'>
            {[
              { name: t('nav_gasha'), href: '/Gasha' },
              { name: t('nav_nisir'), href: '/Nisir' },
              { name: t('nav_enyuma'), href: '/Enyuma_IAM' },
              { name: t('nav_code_protection'), href: '/Code_Protection' },
              { name: t('nav_biometrics'), href: '/Biometrics' },
              { name: t('nav_contact_us'), href: '/Contact_us' },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className='block text-sm font-medium dark:text-gray-100 text-primary hover:text-gray-100 dark:hover:text-primary'
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {!user ? (
              <button
                className='inline-block text-sm font-semibold px-3 py-2 rounded bg-primary text-white shadow-md'
                onClick={() => {
                  setLoginModalOpen(true)
                  setMobileMenuOpen(false)
                }}
              >
                {t('nav_login')}
              </button>
            ) : (
              <div className='flex items-center gap-4'>
                <Link
                  href={`/${
                    user.role === 'admin'
                      ? 'Admin'
                      : user.role === 'manager'
                      ? 'Manager'
                      : ''
                  }`}
                  className='text-sm font-semibold px-3 py-1 rounded bg-primary text-white shadow-md'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {user.role === 'admin'
                    ? t('nav_role_admin')
                    : user.role === 'manager'
                    ? t('nav_role_manager')
                    : user.role}
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className='text-sm font-medium text-red-500'
                >
                  {t('nav_logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Login Modal with Glowing Effects */}
      {loginModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
          <div className='bg-white dark:bg-gray-900 p-6 rounded-lg shadow-2xl w-full max-w-sm border border-primary'>
            <h2 className='text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 text-center'>
              Secure Login
            </h2>

            <input
              type='email'
              placeholder='Email'
              className='w-full mb-3 p-2 border rounded dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary shadow-[0_0_10px_rgba(0,123,255,0.5)]'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type='password'
              placeholder='Password'
              className='w-full mb-4 p-2 border rounded dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary shadow-[0_0_10px_rgba(0,123,255,0.5)]'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {notification && (
              <div
                className={`mt-2 px-4 py-2 rounded-lg shadow-lg border-2 ${
                  notification.type === 'error'
                    ? 'bg-red-600 text-white border-red-400'
                    : 'bg-green-600 text-white border-green-400'
                }`}
                style={{ animation: 'fadeInOut 3.5s ease-out forwards' }}
              >
                {notification.message}
              </div>
            )}

            <div className='flex justify-between items-center mt-4'>
              <button
                onClick={handleLogin}
                className='bg-primary text-white px-4 py-2 rounded shadow-[0_0_15px_rgba(0,123,255,0.7)] hover:shadow-[0_0_20px_rgba(0,123,255,0.9)] transition'
              >
                Login
              </button>
              <button
                onClick={() => setLoginModalOpen(false)}
                className='text-gray-600 dark:text-gray-300 hover:underline'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
