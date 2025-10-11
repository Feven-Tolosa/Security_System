'use client'

import { ChangeEvent, FormEvent, useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'

export interface ManagerProfile {
  name: string
  email: string
  avatar: string
  phone: string
}

interface Props {
  profile: ManagerProfile
  setProfile: (profile: ManagerProfile) => void
  setMessages: (message: { type: string; text: string } | null) => void
}

export default function ManagerProfileSettings({
  profile,
  setProfile,
  setMessages,
}: Props) {
  const { t } = useLanguage()
  const [avatarPreview, setAvatarPreview] = useState<string>(
    profile.avatar || ''
  )
  const [form, setForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setAvatarPreview(profile.avatar || '')
  }, [profile.avatar])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setMessages({ type: 'error', text: t('avatar_file_too_large') })
      setTimeout(() => setMessages(null), 3000)
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setAvatarPreview(result)
      // Update profile immediately
      const updatedProfile: ManagerProfile = { ...profile, avatar: result }
      setProfile(updatedProfile)
      localStorage.setItem('manager-profile', JSON.stringify(updatedProfile))
      setMessages({ type: 'success', text: t('avatar_updated') })
      setTimeout(() => setMessages(null), 3000)
    }
    reader.readAsDataURL(file)
  }

  const removeAvatar = () => {
    setAvatarPreview('')
    const updatedProfile: ManagerProfile = { ...profile, avatar: '' }
    setProfile(updatedProfile)
    localStorage.setItem('manager-profile', JSON.stringify(updatedProfile))
    setMessages({ type: 'success', text: t('avatar_removed') })
    setTimeout(() => setMessages(null), 3000)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(form.email)) {
        setMessages({ type: 'error', text: t('invalid_email') })
        setTimeout(() => setMessages(null), 3000)
        setIsLoading(false)
        return
      }

      const updatedProfile: ManagerProfile = {
        ...profile,
        name: form.name,
        email: form.email,
        phone: form.phone,
        avatar: avatarPreview,
      }

      setProfile(updatedProfile)
      localStorage.setItem('manager-profile', JSON.stringify(updatedProfile))
      setMessages({ type: 'success', text: t('profile_updated') })
    } catch (error) {
      setMessages({ type: 'error', text: t('profile_update_failed') })
    } finally {
      setTimeout(() => setMessages(null), 3000)
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6 bg-gray-800/50 p-6 rounded-xl border border-gray-700/30 shadow-xl'
    >
      <div className='flex items-center gap-6'>
        <div className='relative w-24 h-24 rounded-full overflow-hidden bg-gray-700 border-2 border-gray-600 flex items-center justify-center'>
          {avatarPreview ? (
            <Image
              src={avatarPreview}
              alt='Avatar'
              className='w-full h-full object-cover'
            />
          ) : (
            <span className='text-2xl text-color-primary'>
              {form.name?.charAt(0).toUpperCase() || '?'}
            </span>
          )}
          {avatarPreview && (
            <button
              type='button'
              onClick={removeAvatar}
              className='absolute -top-1 -right-1 w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors'
            >
              ×
            </button>
          )}
        </div>

        <div className='flex-1'>
          <label className='block mb-2 text-gray-300'>{t('avatar')}</label>
          <input
            type='file'
            accept='image/*'
            onChange={handleAvatarChange}
            className='w-full text-gray-300 bg-color-primary px-4 py-2 rounded-lg border border-gray-600/50 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-color-primary file:text-white hover:file:bg-color-primary transition-colors'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block mb-2 text-gray-300'>{t('name')}</label>
          <input
            type='text'
            name='name'
            value={form.name}
            onChange={handleChange}
            className='w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors'
            required
          />
        </div>

        <div>
          <label className='block mb-2 text-gray-300'>{t('email')}</label>
          <input
            type='email'
            name='email'
            value={form.email}
            onChange={handleChange}
            className='w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors'
            required
          />
        </div>

        <div>
          <label className='block mb-2 text-gray-300'>{t('phone')}</label>
          <input
            type='text'
            name='phone'
            value={form.phone}
            onChange={handleChange}
            className='w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors'
          />
        </div>
      </div>

      <button
        type='submit'
        disabled={isLoading}
        className='bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-pink-500/20'
      >
        {isLoading ? t('saving') : t('save_profile')}
      </button>
    </form>
  )
}
