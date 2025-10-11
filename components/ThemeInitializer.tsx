// components/ThemeInitializer.tsx
'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

export default function ThemeInitializer() {
  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme('dark') // Force dark mode on client-side
  }, [setTheme])

  useEffect(() => {
    console.log('Initializing dark mode')
    setTheme('dark')
    console.log('Current theme:', document.documentElement.classList)
  }, [setTheme])

  return null
}
