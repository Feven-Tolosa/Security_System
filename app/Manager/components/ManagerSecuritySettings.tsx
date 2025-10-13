'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface Props {
  security: ManagerSecurity
  setSecurity: React.Dispatch<React.SetStateAction<ManagerSecurity>>
  setMessages: React.Dispatch<
    React.SetStateAction<{ type: string; text: string } | null>
  >
}

export interface ManagerSecurity {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  twoFactorEnabled: boolean
  loginAlerts: boolean
  passwordLastChanged: string
}

export default function ManagerSecuritySettings({
  security,
  setSecurity,
  setMessages,
}: Props) {
  const { t } = useLanguage()
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
  })

  // Password strength checker
  useEffect(() => {
    if (!security.newPassword) {
      setPasswordStrength({ score: 0, feedback: '' })
      return
    }

    const strength = checkPasswordStrength(security.newPassword)
    setPasswordStrength(strength)
  }, [security.newPassword])

  const checkPasswordStrength = (password: string) => {
    let score = 0
    const feedback: string[] = []

    if (password.length >= 8) score++
    else feedback.push('At least 8 characters')

    if (/[a-z]/.test(password)) score++
    else feedback.push('Lowercase letters')

    if (/[A-Z]/.test(password)) score++
    else feedback.push('Uppercase letters')

    if (/[0-9]/.test(password)) score++
    else feedback.push('Numbers')

    if (/[^A-Za-z0-9]/.test(password)) score++
    else feedback.push('Special characters')

    const strengthText =
      score >= 4 ? t('strong') : score >= 3 ? t('good') : t('weak')

    return {
      score: score / 5,
      feedback: feedback.length
        ? `Missing: ${feedback.join(', ')}`
        : strengthText,
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setSecurity((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const saveSecurity = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validations
    if (
      security.newPassword &&
      security.newPassword !== security.confirmPassword
    ) {
      setMessages({ type: 'error', text: t('passwords_do_not_match') })
      return
    }

    setSecurity((prev) => ({
      ...prev,
      passwordLastChanged: security.newPassword
        ? new Date().toISOString()
        : prev.passwordLastChanged,
    }))

    setMessages({ type: 'success', text: t('security_updated') })
  }

  const getPasswordStrengthColor = (score: number) => {
    return score >= 0.8
      ? 'bg-green-500'
      : score >= 0.6
      ? 'bg-blue-500'
      : score >= 0.4
      ? 'bg-yellow-500'
      : score >= 0.2
      ? 'bg-orange-500'
      : 'bg-red-500'
  }

  return (
    <form onSubmit={saveSecurity} className='space-y-6'>
      <h2 className='text-xl font-semibold text-white'>
        {t('admin_security_settings')}
      </h2>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='space-y-4'>
          <label className='block text-gray-300'>
            {t('admin_current_password')}
          </label>
          <input
            type='password'
            name='currentPassword'
            value={security.currentPassword}
            onChange={handleChange}
            className='w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600'
            placeholder={t('admin_current_password')}
          />

          <label className='block text-gray-300'>
            {t('admin_new_password')}
          </label>
          <input
            type='password'
            name='newPassword'
            value={security.newPassword}
            onChange={handleChange}
            className='w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600'
            placeholder={t('admin_new_password')}
          />
          {security.newPassword && (
            <div className='mt-1 w-full bg-gray-700 h-2 rounded-full'>
              <div
                className={`h-2 rounded-full ${getPasswordStrengthColor(
                  passwordStrength.score
                )}`}
                style={{ width: `${passwordStrength.score * 100}%` }}
              />
            </div>
          )}

          <label className='block text-gray-300'>
            {t('admin_confirm_new_password')}
          </label>
          <input
            type='password'
            name='confirmPassword'
            value={security.confirmPassword}
            onChange={handleChange}
            className='w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600'
            placeholder={t('admin_confirm_new_password')}
          />
        </div>

        <div className='space-y-4'>
          <div className='flex items-center gap-3'>
            <input
              type='checkbox'
              name='twoFactorEnabled'
              checked={security.twoFactorEnabled}
              onChange={handleChange}
              className='w-4 h-4 text-blue-500 bg-gray-600 border-gray-400 rounded focus:ring-blue-500'
            />
            <label className='text-gray-200'>
              {t('admin_two_factor_auth')}
            </label>
          </div>

          <div className='flex items-center gap-3'>
            <input
              type='checkbox'
              name='loginAlerts'
              checked={security.loginAlerts}
              onChange={handleChange}
              className='w-4 h-4 text-blue-500 bg-gray-600 border-gray-400 rounded focus:ring-blue-500'
            />
            <label className='text-gray-200'>{t('admin_login_alerts')}</label>
          </div>

          <div className='text-sm text-gray-400'>
            <span>{t('admin_last_changed')}: </span>
            <span>
              {new Date(security.passwordLastChanged).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <button
        type='submit'
        className='bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-secondary transition-all'
      >
        {t('admin_security_settings')}
      </button>
    </form>
  )
}
