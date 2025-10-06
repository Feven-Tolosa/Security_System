'use client'
import { useEffect, useState } from 'react'

interface Message {
  id: number
  email: string
  content: string
  seen: boolean
  createdAt: string
  replied?: boolean // new field in UI state (not in DB)
}

export default function MessagesComponent() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Reply state
  const [replyMode, setReplyMode] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replySending, setReplySending] = useState(false)

  // Popup notification
  const [popup, setPopup] = useState<string | null>(null)

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages/all')
      const data = await res.json()
      if (res.ok) {
        setMessages(data)
      } else {
        setError(data.error || 'Failed to load messages')
      }
    } catch (err) {
      setError('Error fetching messages')
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
          subject: 'Reply from Manager Dashboard',
          reply: replyText,
        }),
      })

      if (res.ok) {
        // Close modal + clear text
        setReplyMode(null)
        setReplyText('')

        // Update local state: mark as seen + replied
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === id ? { ...msg, seen: true, replied: true } : msg
          )
        )

        // Show success popup
        setPopup('Reply sent successfully ✅')
        setTimeout(() => setPopup(null), 3000)
      } else {
        setPopup('Failed to send reply ❌')
        setTimeout(() => setPopup(null), 3000)
      }
    } catch (err) {
      console.error(err)
      setPopup('Error while sending reply ❌')
      setTimeout(() => setPopup(null), 3000)
    } finally {
      setReplySending(false)
    }
  }

  return (
    <div className='relative'>
      {/* Popup Notification */}
      {popup && (
        <div className='fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in'>
          {popup}
        </div>
      )}

      {/* Messages Table */}
      <div className='overflow-x-auto rounded-lg border border-gray-700'>
        <table className='min-w-full text-left text-sm'>
          <thead className='bg-gray-800 text-gray-300 uppercase text-xs'>
            <tr>
              <th className='px-4 py-3'>Email</th>
              <th className='px-4 py-3'>Message</th>
              <th className='px-4 py-3'>Status</th>
              <th className='px-4 py-3'>Created At</th>
              <th className='px-4 py-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className='px-4 py-6 text-center'>
                  Loading messages...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className='px-4 py-6 text-center text-red-400'>
                  {error}
                </td>
              </tr>
            ) : messages.length === 0 ? (
              <tr>
                <td colSpan={5} className='px-4 py-6 text-center text-gray-400'>
                  No messages found.
                </td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr
                  key={msg.id}
                  className={`border-t border-gray-700 ${
                    msg.seen ? 'bg-gray-800/40' : 'bg-gray-800/80'
                  }`}
                >
                  <td className='px-4 py-3'>{msg.email}</td>
                  <td className='px-4 py-3'>{msg.content}</td>
                  <td className='px-4 py-3'>
                    {msg.replied ? (
                      <span className='text-blue-400 font-semibold'>
                        Replied
                      </span>
                    ) : msg.seen ? (
                      <span className='text-green-400 font-semibold'>Seen</span>
                    ) : (
                      <span className='text-yellow-400 font-semibold'>
                        Unseen
                      </span>
                    )}
                  </td>
                  <td className='px-4 py-3'>
                    {new Date(msg.createdAt).toLocaleString()}
                  </td>
                  <td className='px-4 py-3 space-x-2'>
                    {!msg.seen && !msg.replied && (
                      <button
                        onClick={() => markAsRead(msg.id)}
                        className='px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg'
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className='px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded-lg'
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setReplyMode(msg.id)}
                      className='px-3 py-1 text-sm bg-green-600 hover:bg-green-700 rounded-lg'
                    >
                      Reply
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Reply Form */}
      {replyMode && (
        <div className='fixed inset-0 flex justify-center items-center bg-black/70'>
          <div className='bg-gray-800 p-6 rounded-lg w-96'>
            <h3 className='text-lg font-bold mb-4'>Reply to Message</h3>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className='w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white mb-4'
              rows={5}
              placeholder='Type your reply...'
            />
            <div className='flex justify-end space-x-2'>
              <button
                onClick={() => setReplyMode(null)}
                className='px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded-lg'
              >
                Cancel
              </button>
              <button
                disabled={replySending}
                onClick={() =>
                  sendReply(
                    messages.find((m) => m.id === replyMode)?.email || '',
                    replyMode
                  )
                }
                className='px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50'
              >
                {replySending ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
