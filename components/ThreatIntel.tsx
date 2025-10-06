import React from 'react'

const threats = [
  { name: 'Emerging Malware', risk: 'High' },
  { name: 'Phishing Campaign', risk: 'Medium' },
  { name: 'Ransomware Variant', risk: 'High' },
]

const ThreatIntel = () => {
  return (
    <div className='bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md'>
      <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-2'>
        Threat Intelligence (Enyuma)
      </h2>
      <ul className='space-y-2'>
        {threats.map((t, idx) => (
          <li
            key={idx}
            className={`flex justify-between p-3 rounded-lg ${
              t.risk === 'High'
                ? 'bg-gray-900 text-white'
                : t.risk === 'Medium'
                ? 'bg-gray-900 text-black'
                : 'bg-gray-900 text-white'
            }`}
          >
            <span>{t.name}</span>
            <span className='font-semibold px-3 py-1 bg-blue-600 text-white rounded-lg text-sm'>
              {t.risk}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ThreatIntel
