'use client'

import React, { useState, useEffect } from 'react'
import { Bars3Icon, MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../public/image/logo.png'
import { useRouter, usePathname } from 'next/navigation'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  // State for notification
  const [notification, setNotification] = useState<{
    message: string
    type: 'error' | 'success'
  } | null>(null)

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('loggedIn') === 'true'
    const storedRole = localStorage.getItem('role') || ''
    setLoggedIn(storedLoggedIn)
    setRole(storedRole)
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
    (!loggedIn || role.toLowerCase() !== currentRouteRole)

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

  // Authentication check using environment variables
  const handleLogin = () => {
    const storedLoggedIn = localStorage.getItem('loggedIn') === 'true'
    const storedRole = localStorage.getItem('role') || ''
    if (storedLoggedIn && storedRole) {
      setLoggedIn(true)
      setRole(storedRole)
      setLoginModalOpen(false)
      router.push(`/${storedRole}`)
      return
    }

    if (!role || !email || !password) {
      setNotification({
        message: 'Please fill in all fields.',
        type: 'error',
      })
      console.log('Setting notification:', {
        message: 'Please fill in all fields.',
        type: 'error',
      }) // Debug log
      setTimeout(() => setNotification(null), 3000)
      return
    }

    let validCredentials = false
    if (role === 'Admin') {
      validCredentials =
        email === process.env.NEXT_PUBLIC_ADMIN_EMAIL &&
        password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    } else if (role === 'Manager') {
      validCredentials =
        email === process.env.NEXT_PUBLIC_MANAGER_EMAIL &&
        password === process.env.NEXT_PUBLIC_MANAGER_PASSWORD
    }

    if (!validCredentials) {
      setNotification({
        message:
          'Authentication failed. Please check your credentials and try again.',
        type: 'error',
      })
      console.log('Setting notification:', {
        message:
          'Authentication failed. Please check your credentials and try again.',
        type: 'error',
      }) // Debug log
      setTimeout(() => setNotification(null), 3000)
      return
    }

    localStorage.setItem('loggedIn', 'true')
    localStorage.setItem('role', role)
    setLoggedIn(true)
    setRole(role)
    setLoginModalOpen(false)
    router.push(`/${role}`)
  }

  const handleLogout = () => {
    localStorage.removeItem('loggedIn')
    localStorage.removeItem('role')
    setLoggedIn(false)
    setRole('')
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
              { name: 'Gasha', href: '/Gasha' },
              { name: 'Nisir', href: '/Nisir' },
              { name: 'Enyuma IAM', href: '/Enyuma_IAM' },
              { name: 'Code Protection', href: '/Code_Protection' },
              { name: 'Biometrics', href: '/Biometrics' },
              { name: 'Contact us', href: '/Contact_us' },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className='text-sm font-medium dark:text-gray-100 text-primary hover:text-gray-100 dark:hover:text-primary'
              >
                {item.name}
              </Link>
            ))}

            {!loggedIn ? (
              <button
                onClick={() => setLoginModalOpen(true)}
                className='text-sm font-medium dark:text-gray-100 text-primary hover:text-gray-100 dark:hover:text-primary'
              >
                Login
              </button>
            ) : (
              <div className='flex items-center gap-4'>
                <Link
                  href={`/${role}`}
                  className='text-sm font-semibold px-3 py-1 rounded bg-primary text-white shadow-md hover:shadow-lg transition'
                >
                  {role}
                </Link>
                <button
                  onClick={handleLogout}
                  className='text-sm font-medium text-red-500 hover:text-red-700'
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
            aria-label='Toggle theme'
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
          onClick={() => setMobileMenuOpen(true)}
        >
          <Bars3Icon className='h-6 w-6' />
        </button>
      </nav>

      {/* Login Modal with Glowing Effects */}
      {loginModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
          <div className='bg-white dark:bg-gray-900 p-6 rounded-lg shadow-2xl w-full max-w-sm border border-primary'>
            <h2 className='text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 text-center'>
              Role-Based Login
            </h2>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className='w-full mb-3 p-2 border rounded dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary shadow-[0_0_10px_rgba(0,123,255,0.5)]'
            >
              <option value=''>Select Role</option>
              <option value='Admin'>Admin</option>
              <option value='Manager'>Manager</option>
            </select>

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

            {/* Notification */}
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

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          10% {
            opacity: 1;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
      `}</style>
    </header>
  )
}

export default Navbar
