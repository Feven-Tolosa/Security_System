import React from 'react'

const logs = [
  {
    type: 'WAF',
    event: 'SQL Injection attempt blocked',
    severity: 'High',
    time: new Date().toLocaleString(),
  },
  {
    type: 'VPN',
    event: 'Unauthorized login attempt',
    severity: 'Medium',
    time: new Date().toLocaleString(),
  },
  {
    type: 'SIEM',
    event: 'Suspicious traffic detected',
    severity: 'High',
    time: new Date().toLocaleString(),
  },
]

const SecurityLogs = () => {
  return (
    <div className='bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md col-span-2'>
      <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-2'>
        Security Logs
      </h2>
      <div className='space-y-2 max-h-64 overflow-y-auto'>
        {logs.map((log, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg flex justify-between items-center ${
              log.severity === 'High'
                ? 'bg-gray-900 text-white'
                : log.severity === 'Medium'
                ? 'bg-gray-600 text-black'
                : 'bg-gray-900 text-white'
            }`}
          >
            <div>
              <p className='font-medium'>{log.event}</p>
              <p className='text-xs'>
                {log.type} | {log.time}
              </p>
            </div>
            <span className='text-sm font-semibold'>{log.severity}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SecurityLogs
