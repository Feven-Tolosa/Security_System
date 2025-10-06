import React from 'react'

const SecurityLogs = () => {
  return (
    <div className='bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md col-span-2'>
      <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-2'>
        Security Logs
      </h2>
      <p className='text-sm text-gray-600 dark:text-gray-300'>
        Recent firewall events, VPN logs, SIEM alerts.
      </p>
    </div>
  )
}

export default SecurityLogs
