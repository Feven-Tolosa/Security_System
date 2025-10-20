'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'

import ManagerSecuritySettings, {
  ManagerSecurity,
} from '../components/ManagerSecuritySettings'
import ManagerSystemSettings, {
  ManagerSystem,
} from '../components/ManagerSystemSettings'
import ManagerProfileSettings, {
  ManagerProfile,
} from '../components/ManagerProfileSettings'

type Tab = 'profile' | 'security' | 'system'

export default function ManagerSettingsPage() {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [messages, setMessages] = useState<{
    type: string
    text: string
  } | null>(null)

  const [profile, setProfile] = useState<ManagerProfile>({
    name: '',
    email: '',
    avatar: '',
    phone: '',
  })

  const [security, setSecurity] = useState<ManagerSecurity>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    loginAlerts: true,
    passwordLastChanged: new Date().toISOString(),
  })

  const [system, setSystem] = useState<ManagerSystem>({
    theme: 'system',
    autoBackup: false,
    backupFrequency: 'weekly',
  })

  // Load saved settings
  useEffect(() => {
    const savedProfile = localStorage.getItem('manager-profile')
    const savedSecurity = localStorage.getItem('manager-security')
    const savedSystem = localStorage.getItem('manager-system')

    if (savedProfile) setProfile(JSON.parse(savedProfile))
    if (savedSecurity) setSecurity(JSON.parse(savedSecurity))
    if (savedSystem) setSystem(JSON.parse(savedSystem))
  }, [])

  const isDark = theme === 'dark'

  const tabs: { label: string; value: Tab }[] = [
    { label: t('profile'), value: 'profile' },
    { label: t('security'), value: 'security' },
    { label: t('system'), value: 'system' },
  ]

  return (
    <main
      className={`pt-24 pb-16 px-6 max-w-5xl mx-auto min-h-screen transition-colors duration-500 ${
        isDark ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-900'
      }`}
    >
      {/* Page Header */}
      <motion.div
        className='mb-10 text-center'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className='text-4xl font-bold text-primary drop-shadow-lg'>
          {t('settings')}
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          {t('manager_settings_subtitle')}
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className={`flex gap-4 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-300'
        } pb-2 justify-center`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`px-5 py-2 rounded-t-lg font-medium transition-all duration-300 ${
              activeTab === tab.value
                ? 'bg-primary text-white shadow-md shadow-primary/40'
                : isDark
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Message Box */}
      <AnimatePresence>
        {messages && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-4 p-4 rounded-lg shadow-md text-center ${
              messages.type === 'success'
                ? 'bg-green-600/80 text-white shadow-green-400/30'
                : 'bg-red-600/80 text-white shadow-red-400/30'
            }`}
          >
            {messages.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Tab Content */}
      <div className='mt-8'>
        <AnimatePresence mode='wait'>
          {activeTab === 'profile' && (
            <motion.div
              key='profile'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className={`rounded-2xl shadow-xl ${
                isDark ? 'bg-gray-900/60' : 'bg-white/90'
              } p-6`}
            >
              <ManagerProfileSettings
                profile={profile}
                setProfile={setProfile}
                setMessages={setMessages}
              />
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              key='security'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className={`rounded-2xl shadow-xl ${
                isDark ? 'bg-gray-900/60' : 'bg-white/90'
              } p-6`}
            >
              <ManagerSecuritySettings
                security={security}
                setSecurity={setSecurity}
                setMessages={setMessages}
              />
            </motion.div>
          )}

          {activeTab === 'system' && (
            <motion.div
              key='system'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className={`rounded-2xl shadow-xl ${
                isDark ? 'bg-gray-900/60' : 'bg-white/90'
              } p-6`}
            >
              <ManagerSystemSettings
                system={system}
                setSystem={setSystem}
                setMessages={setMessages}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
