import React from 'react'

const services = [
  { name: 'Gasha WAF', status: 'Running' },
  { name: 'Gasha VPN', status: 'Running' },
  { name: 'Nisir SIEM', status: 'Down' },
  { name: 'Enyuma IAM', status: 'Running' },
  { name: 'Cyber Defense Suite', status: 'Running' },
  { name: 'Biometric Protection', status: 'Running' },
  { name: 'Gasha Antivirus', status: 'Running' },
]

const ServiceMonitor = () => {
  return (
    <div className='bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md'>
      <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-2'>
        Service Monitor
      </h2>
      <ul className='space-y-2'>
        {services.map((s) => (
          <li
            key={s.name}
            className='flex justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-700'
          >
            <span className='font-medium text-gray-800 dark:text-white'>
              {s.name}
            </span>
            <span
              className={`px-2 py-1 rounded text-white ${
                s.status === 'Running' ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {s.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ServiceMonitor
