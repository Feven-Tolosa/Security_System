'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className='p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition-transform'
      title='Toggle theme'
    >
      {theme === 'dark' ? (
        <Sun size={20} className='text-yellow-400' />
      ) : (
        <Moon size={20} className='text-gray-800' />
      )}
    </motion.button>
  )
}

export default ThemeToggle
