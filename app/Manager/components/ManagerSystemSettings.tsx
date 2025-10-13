'use client'

import { useLanguage } from '@/contexts/LanguageContext'

interface Props {
  system: ManagerSystem
  setSystem: React.Dispatch<React.SetStateAction<ManagerSystem>>
  setMessages: React.Dispatch<
    React.SetStateAction<{ type: string; text: string } | null>
  >
}

export interface ManagerSystem {
  theme: 'dark' | 'light' | 'system'
  autoBackup: boolean
  backupFrequency: 'daily' | 'weekly' | 'monthly'
}

export default function ManagerSystemSettings({
  system,
  setSystem,
  setMessages,
}: Props) {
  const { t } = useLanguage()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setSystem((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const saveSystem = (e: React.FormEvent) => {
    e.preventDefault()
    setMessages({ type: 'success', text: t('system_settings_saved') })

    // Apply theme live
    const root = document.documentElement
    if (system.theme === 'light') {
      root.classList.remove('dark')
    } else if (system.theme === 'dark') {
      root.classList.add('dark')
    }
  }

  return (
    <form onSubmit={saveSystem} className='space-y-6'>
      <h2 className='text-xl font-semibold text-white'>
        {t('admin_save_preferences')}
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block mb-2 text-gray-300'>
            {t('aria_toggle_theme')}
          </label>
          <select
            name='theme'
            value={system.theme}
            onChange={handleChange}
            className='w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600'
          >
            <option value='dark'>{t('option_dark')}</option>
            <option value='light'>{t('option_light')}</option>
            <option value='system'>{t('option_system_default')}</option>
          </select>
        </div>

        <div className='flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg border border-gray-600'>
          <input
            type='checkbox'
            name='autoBackup'
            checked={system.autoBackup}
            onChange={handleChange}
            className='w-4 h-4 text-blue-500 bg-gray-600 border-gray-400 rounded focus:ring-blue-500'
          />
          <div>
            <label className='text-gray-200'>
              {t('admin_automatic_backups')}
            </label>
            <p className='text-sm text-gray-400'>
              {t('admin_auto_backup_hint')}
            </p>
          </div>
        </div>

        {system.autoBackup && (
          <div>
            <label className='block mb-2 text-gray-300'>
              {t('admin_backup_frequency')}
            </label>
            <select
              name='backupFrequency'
              value={system.backupFrequency}
              onChange={handleChange}
              className='w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600'
            >
              <option value='daily'>{t('daily')}</option>
              <option value='weekly'>{t('weekly')}</option>
              <option value='monthly'>{t('monthly')}</option>
            </select>
          </div>
        )}
      </div>

      <button
        type='submit'
        className='bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-secondary transition-all'
      >
        {t('admin_save_preferences')}
      </button>
    </form>
  )
}
