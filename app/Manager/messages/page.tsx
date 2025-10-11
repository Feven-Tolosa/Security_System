'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface Message {
  id: number
  email: string
  content: string
  seen: boolean
  createdAt: string
  replied?: boolean
}

export default function MessagesComponent() {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [replyMode, setReplyMode] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replySending, setReplySending] = useState(false)
  const [popup, setPopup] = useState<string | null>(null)

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages/all')
      const data = await res.json()
      if (res.ok) setMessages(data)
      else setError(data.error || t('error_loading'))
    } catch (err) {
      setError(t('fetch_error'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const markAsRead = async (id: number) => {
    await fetch('/api/messages/all', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchMessages()
  }

  const deleteMessage = async (id: number) => {
    await fetch('/api/messages/all', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchMessages()
  }

  const sendReply = async (email: string, id: number) => {
    setReplySending(true)
    try {
      const res = await fetch('/api/messages/all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: t('reply_subject'),
          reply: replyText,
        }),
      })

      if (res.ok) {
        setReplyMode(null)
        setReplyText('')
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === id ? { ...msg, seen: true, replied: true } : msg
          )
        )
        setPopup(t('reply_success'))
      } else {
        setPopup(t('reply_failed'))
      }
    } catch {
      setPopup(t('reply_error'))
    } finally {
      setReplySending(false)
      setTimeout(() => setPopup(null), 3000)
    }
  }

  return (
    <div className='relative p-4'>
      {/* Popup Notification */}
      {popup && (
        <div className='fixed top-4 right-4 bg-[var(--color-secondary)] text-white px-4 py-2 rounded-lg shadow-lg transition-all'>
          {popup}
        </div>
      )}

      {/* Messages Table */}
      <div className='overflow-x-auto rounded-xl border border-gray-300 dark:border-gray-700 shadow-md'>
        <table className='min-w-full text-sm'>
          <thead className='uppercase text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100'>
            <tr>
              <th className='px-4 py-3'>{t('email')}</th>
              <th className='px-4 py-3'>{t('message')}</th>
              <th className='px-4 py-3'>{t('status')}</th>
              <th className='px-4 py-3'>{t('created_at')}</th>
              <th className='px-4 py-3'>{t('actions')}</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className='px-4 py-6 text-center'>
                  {t('loading')}
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className='px-4 py-6 text-center text-red-500'>
                  {error}
                </td>
              </tr>
            ) : messages.length === 0 ? (
              <tr>
                <td colSpan={5} className='px-4 py-6 text-center text-gray-500'>
                  {t('no_messages')}
                </td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr
                  key={msg.id}
                  className={`border-t border-gray-200 dark:border-gray-700 ${
                    msg.seen
                      ? 'bg-gray-50 dark:bg-gray-900'
                      : 'bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/20'
                  } hover:bg-[var(--color-primary)]/20 dark:hover:bg-[var(--color-primary)]/30 transition`}
                >
                  <td className='px-4 py-3 text-gray-800 dark:text-gray-100'>
                    {msg.email}
                  </td>
                  <td className='px-4 py-3 text-gray-700 dark:text-gray-200'>
                    {msg.content}
                  </td>
                  <td className='px-4 py-3'>
                    {msg.replied ? (
                      <span className='text-blue-500 font-semibold'>
                        {t('replied')}
                      </span>
                    ) : msg.seen ? (
                      <span className='text-green-500 font-semibold'>
                        {t('seen')}
                      </span>
                    ) : (
                      <span className='text-yellow-500 font-semibold'>
                        {t('unseen')}
                      </span>
                    )}
                  </td>
                  <td className='px-4 py-3 text-gray-600 dark:text-gray-300'>
                    {new Date(msg.createdAt).toLocaleString()}
                  </td>
                  <td className='px-4 py-3 space-x-2'>
                    {!msg.seen && !msg.replied && (
                      <button
                        onClick={() => markAsRead(msg.id)}
                        className='px-3 py-1 text-sm rounded-md bg-[var(--color-primary)] text-white hover:opacity-90 transition'
                      >
                        {t('mark_as_read')}
                      </button>
                    )}
                    <button
                      onClick={() => setReplyMode(msg.id)}
                      className='px-3 py-1 text-sm rounded-md bg-[var(--color-secondary)] text-white hover:opacity-90 transition'
                    >
                      {t('reply')}
                    </button>
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className='px-3 py-1 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition'
                    >
                      {t('delete')}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Reply Modal */}
      {replyMode && (
        <div className='fixed inset-0 flex justify-center items-center bg-black/70 z-50'>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow-2xl'>
            <h3 className='text-lg font-bold mb-4 text-gray-900 dark:text-gray-100'>
              {t('reply_message')}
            </h3>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className='w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 
              bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white mb-4'
              rows={5}
              placeholder={t('type_reply')}
            />
            <div className='flex justify-end gap-2'>
              <button
                onClick={() => setReplyMode(null)}
                className='px-3 py-1 bg-gray-400 dark:bg-gray-700 text-white rounded-md hover:opacity-90 transition'
              >
                {t('cancel')}
              </button>
              <button
                disabled={replySending}
                onClick={() =>
                  sendReply(
                    messages.find((m) => m.id === replyMode)?.email || '',
                    replyMode
                  )
                }
                className='px-3 py-1 bg-[var(--color-primary)] text-white rounded-md hover:opacity-90 transition disabled:opacity-50'
              >
                {replySending ? t('sending') : t('send')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
