import React from 'react'

const reviews = [
  { title: 'Monthly Security Audit', due: 'Tomorrow, 10:00 AM' },
  { title: 'Quarterly VPN Review', due: 'Friday, 2:00 PM' },
]

const ScheduledReviews = () => {
  return (
    <div className='bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md'>
      <h2 className='text-lg py-3 font-semibold text-gray-800 dark:text-white mb-2'>
        Scheduled Reviews
      </h2>
      <ul className='space-y-2'>
        {reviews.map((r, idx) => (
          <li
            key={idx}
            className='flex justify-between items-center p-3 dark:bg-gray-900 rounded-lg'
          >
            <div>
              <p className='font-medium text-gray-800 dark:text-white'>
                {r.title}
              </p>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                {r.due}
              </p>
            </div>
            <button className='px-3 py-1 bg-blue-600 text-white rounded-lg text-sm'>
              Start
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ScheduledReviews
