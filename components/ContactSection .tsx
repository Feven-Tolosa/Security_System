'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Textarea } from '@headlessui/react'
import { useLanguage } from '@/contexts/LanguageContext'
import GlitchText from './GlitchText'

gsap.registerPlugin(ScrollTrigger)
const ContactSection = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [showError, setShowError] = useState(false)
  const [status, setStatus] = useState<'success' | 'error' | null>(null)

  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top center',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }
  }, [])

  const handleSend = async () => {
    if (!email.trim() || !message.trim()) {
      setShowError(true)
      setStatus('error')
      return
    }

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      })

      if (res.ok) {
        setEmail('')
        setMessage('')
        setShowError(false)
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error(error)
      setStatus('error')
    }

    // Hide after 3 seconds
    setTimeout(() => setStatus(null), 3000)
  }

  return (
    <div
      ref={containerRef}
      className='relative w-full py-20 flex justify-center items-center overflow-hidden mt-23'
    >
      <div
        className='relative z-10 max-w-3xl w-full px-8 py-12 bg-black/80 backdrop-blur-md rounded-xl border border-primary transition-all duration-500'
        style={{ boxShadow: '0 0 40px rgba(0, 224, 255, 0.4)' }}
      >
        {status && (
          <div
            className={`mb-4 p-3 rounded-lg text-center font-semibold ${
              status === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {status === 'success'
              ? `✅ ${t('contact_status_success')}`
              : `❌ ${t('contact_status_error')}`}
          </div>
        )}

        <div ref={contentRef} className='space-y-6 text-white text-center'>
          <GlitchText
            speed={1}
            enableShadows={true}
            enableOnHover={true}
            className='custom-class'
          >
            {t('contact_title')}
          </GlitchText>

          <p className='text-lg text-gray-300'>{t('contact_subtitle')}</p>

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className='px-8 py-8 w-full rounded-lg bg-gray-950 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary border-primary'
            placeholder='Your message...'
          />

          <div className='flex justify-center items-center gap-4 pt-4'>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('contact_placeholder_email')}
              required
              className={`px-4 py-2 w-64 rounded-lg bg-gray-950 border ${
                showError ? 'border-red-500' : 'border-primary'
              } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary`}
            />
            <button
              onClick={handleSend}
              className='px-5 py-2 bg-primary hover:bg-secondary text-black font-semibold rounded-lg transition duration-300 hover:shadow-[0_0_10px_#00E0FF]'
            >
              {t('contact_send')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactSection
