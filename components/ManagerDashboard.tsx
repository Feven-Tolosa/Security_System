'use client'
import { useEffect, useState } from 'react'

interface Message {
  id: number
  email: string
  content: string
  seen: boolean
  createdAt: string
}

export default function ManagerDashboard() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Reply state
  const [replyMode, setReplyMode] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replySending, setReplySending] = useState(false)

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

  const sendReply = async (email: string) => {
    setReplySending(true)
    try {
      const res = await fetch('/api/messages/all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: 'Reply from Manager page',
          reply: replyText,
        }),
      })

      if (res.ok) {
        alert('Reply sent successfully ✅')
        setReplyMode(null)
        setReplyText('')
      } else {
        alert('Failed to send reply ❌')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setReplySending(false)
    }
  }

  if (loading) return <div className='p-6 text-white'>Loading messages...</div>
  if (error) return <div className='p-6 text-red-500'>{error}</div>

  return (
    <div className='p-6 pt-35 text-white min-h-screen bg-gray-900'>
      <h1 className='text-2xl font-bold mb-6'>Manager Dashboard</h1>
      <h2 className='text-2xl font-bold mb-6'>📨 Messages </h2>

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
            {messages.map((msg) => (
              <tr
                key={msg.id}
                className={`border-t border-gray-700 ${
                  msg.seen ? 'bg-gray-800/40' : 'bg-gray-800/80'
                }`}
              >
                <td className='px-4 py-3'>{msg.email}</td>
                <td className='px-4 py-3'>{msg.content}</td>
                <td className='px-4 py-3'>
                  {msg.seen ? (
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
                  {!msg.seen && (
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
            ))}

            {messages.length === 0 && (
              <tr>
                <td colSpan={5} className='px-4 py-6 text-center text-gray-400'>
                  No messages found.
                </td>
              </tr>
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
                    messages.find((m) => m.id === replyMode)?.email || ''
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
