interface StatusMessageProps {
  message: { type: string; text: string }
}

export default function StatusMessage({ message }: StatusMessageProps) {
  return (
    <div
      className={`mb-6 p-3 rounded-lg text-center font-medium transition-all ${
        message.type === 'success'
          ? 'bg-green-900/30 text-green-300 border border-green-500/50'
          : message.type === 'error'
          ? 'bg-red-900/30 text-red-300 border border-red-500/50'
          : 'bg-blue-900/30 text-blue-300 border border-blue-500/50'
      }`}
    >
      {message.text}
    </div>
  )
}
