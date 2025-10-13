'use client'

import { useState } from 'react'

import { useLanguage } from '@/contexts/LanguageContext'
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

  const tabs: { label: string; value: Tab }[] = [
    { label: t('profile'), value: 'profile' },
    { label: t('security'), value: 'security' },
    { label: t('system'), value: 'system' },
  ]

  return (
    <div className='p-6 space-y-6 pt-24'>
      <h1 className='text-3xl font-bold text-white'>{t('settings')}</h1>

      {/* Tabs */}
      <div className='flex gap-4 border-b border-gray-600 pb-2'>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`px-4 py-2 rounded-t-lg font-medium ${
              activeTab === tab.value
                ? 'bg-primary text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            } transition-all`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      {messages && (
        <div
          className={`p-4 rounded-lg ${
            messages.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {messages.text}
        </div>
      )}

      {/* Tab content */}
      <div className='mt-4'>
        {activeTab === 'profile' && (
          <ManagerProfileSettings
            profile={profile}
            setProfile={setProfile}
            setMessages={setMessages}
          />
        )}
        {activeTab === 'security' && (
          <ManagerSecuritySettings
            security={security}
            setSecurity={setSecurity}
            setMessages={setMessages}
          />
        )}
        {activeTab === 'system' && (
          <ManagerSystemSettings
            system={system}
            setSystem={setSystem}
            setMessages={setMessages}
          />
        )}
      </div>
    </div>
  )
}
