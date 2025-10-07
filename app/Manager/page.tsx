import React from 'react'
import SIEMDashboard from '@/components/SIEMDashboard'
import MessagesComponent from '@/components/MessagesComponent'

const ManagerDashboard = () => {
  return (
    <div className='p-6 pt-30 bg-gray-50 dark:bg-gray-900 min-h-screen'>
      {/* Header */}
      <header className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
          Security System – Manager Dashboard
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Monitor all security services.
        </p>
      </header>

      {/* Messages FIRST, Full Width */}
      <div className='mb-6'>
        <MessagesComponent />
      </div>

      {/* Responsive Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        {/* SIEM Dashboard */}
        <div className='lg:col-span-12'>
          <SIEMDashboard />
        </div>

        {/* Biometric Monitor */}
        {/* <div className='lg:col-span-12'>
          <BiometricMonitor />
        </div>

        {/* Security Logs (full width row) */}
        {/* <div className='lg:col-span-12'>
          <SecurityLogs />
        </div> */}
        {/* Analytics Overview */}
        {/* <div className='lg:col-span-12'>
          <AnalyticsOverview />
        </div> */}

        {/* Service Monitor
        <div className='lg:col-span-4'>
          <ServiceMonitor />
        </div> */}
        {/* Threat Intel */}
        {/* <div className='lg:col-span-6'>
          <ThreatIntel />
        </div>
         Scheduled Reviews (one-third width) 
        <div className='lg:col-span-6'>
          <ScheduledReviews /> 
        {/* </div> */}
      </div>
    </div>
  )
}

export default ManagerDashboard
