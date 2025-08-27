// // pages/manager/dashboard.tsx
// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/router'
// import Head from 'next/head'
// import DashboardLayout from '../../components/DashboardLayout'

// export default function ManagerDashboard() {
//   const [user, setUser] = useState<any>(null)
//   const router = useRouter()

//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     const userData = JSON.parse(localStorage.getItem('user') || '{}')

//     if (!token || userData.role !== 'manager') {
//       router.push('/login')
//       return
//     }

//     setUser(userData)
//   }, [])

//   if (!user) return <div>Loading...</div>

//   return (
//     <>
//       <Head>
//         <title>Manager Dashboard - Fayda System</title>
//       </Head>
//       <DashboardLayout userRole={user.role} userName={user.name}>
//         <div className='mb-6'>
//           <h2 className='text-2xl font-bold text-gray-800'>
//             Manager Dashboard
//           </h2>
//           <p className='text-gray-600'>
//             Team management and performance monitoring
//           </p>
//         </div>

//         {/* Manager-specific content */}
//         <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8'>
//           <div className='bg-white overflow-hidden shadow rounded-lg'>
//             <div className='px-4 py-5 sm:p-6'>
//               <div className='flex items-center'>
//                 <div className='flex-shrink-0 bg-blue-500 rounded-md p-3'>
//                   <svg
//                     className='h-6 w-6 text-white'
//                     fill='none'
//                     viewBox='0 0 24 24'
//                     stroke='currentColor'
//                   >
//                     <path
//                       strokeLinecap='round'
//                       strokeLinejoin='round'
//                       strokeWidth={2}
//                       d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
//                     />
//                   </svg>
//                 </div>
//                 <div className='ml-5 w-0 flex-1'>
//                   <dl>
//                     <dt className='text-sm font-medium text-gray-500 truncate'>
//                       Team Members
//                     </dt>
//                     <dd className='text-2xl font-semibold text-gray-900'>15</dd>
//                   </dl>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className='bg-white overflow-hidden shadow rounded-lg'>
//             <div className='px-4 py-5 sm:p-6'>
//               <div className='flex items-center'>
//                 <div className='flex-shrink-0 bg-green-500 rounded-md p-3'>
//                   <svg
//                     className='h-6 w-6 text-white'
//                     fill='none'
//                     viewBox='0 0 24 24'
//                     stroke='currentColor'
//                   >
//                     <path
//                       strokeLinecap='round'
//                       strokeLinejoin='round'
//                       strokeWidth={2}
//                       d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
//                     />
//                   </svg>
//                 </div>
//                 <div className='ml-5 w-0 flex-1'>
//                   <dl>
//                     <dt className='text-sm font-medium text-gray-500 truncate'>
//                       Completed Tasks
//                     </dt>
//                     <dd className='text-2xl font-semibold text-gray-900'>
//                       89%
//                     </dd>
//                   </dl>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className='bg-white overflow-hidden shadow rounded-lg'>
//             <div className='px-4 py-5 sm:p-6'>
//               <div className='flex items-center'>
//                 <div className='flex-shrink-0 bg-yellow-500 rounded-md p-3'>
//                   <svg
//                     className='h-6 w-6 text-white'
//                     fill='none'
//                     viewBox='0 0 24 24'
//                     stroke='currentColor'
//                   >
//                     <path
//                       strokeLinecap='round'
//                       strokeLinejoin='round'
//                       strokeWidth={2}
//                       d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
//                     />
//                   </svg>
//                 </div>
//                 <div className='ml-5 w-0 flex-1'>
//                   <dl>
//                     <dt className='text-sm font-medium text-gray-500 truncate'>
//                       Pending Reviews
//                     </dt>
//                     <dd className='text-2xl font-semibold text-gray-900'>7</dd>
//                   </dl>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className='bg-white shadow rounded-lg p-6'>
//           <h3 className='text-lg font-medium text-gray-900 mb-4'>
//             Team Performance
//           </h3>
//           <p className='text-gray-600'>
//             Team management features and performance metrics will be displayed
//             here.
//           </p>
//         </div>
//       </DashboardLayout>
//     </>
//   )
// }
