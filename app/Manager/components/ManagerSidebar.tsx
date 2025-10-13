'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ShieldCheckIcon,
  ChatBubbleBottomCenterTextIcon,
  Cog6ToothIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline'

export default function ManagerSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const navItems = [
    { name: 'Dashboard', href: '/Manager', icon: ShieldCheckIcon },
    {
      name: 'Messages',
      href: '/Manager/messages',
      icon: ChatBubbleBottomCenterTextIcon,
    },
    { name: 'Settings', href: '/Manager/settings', icon: Cog6ToothIcon },
  ]

  return (
    <aside
      className={`hidden md:flex flex-col h-screen pt-24 bg-secondary dark:bg-gray-900 text-white border-r border-gray-700 p-4 transition-all duration-300 ${
        collapsed ? 'w-20 items-center' : 'w-60'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className='mb-4 flex  p-2 rounded-lg'
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronDoubleRightIcon className='h-6 w-6 items-center justify-center text-gray-200' />
        ) : (
          <ChevronDoubleLeftIcon className='h-6 w-6 items-start justify-start text-gray-200' />
        )}
      </button>

      {/* Nav Links */}
      <nav className='flex flex-col space-y-2 w-full'>
        {navItems.map(({ name, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={name}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition group relative ${
                active
                  ? 'bg-primary text-white font-semibold'
                  : 'hover:bg-gray-700 text-gray-200'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon className='h-5 w-5' />

              {!collapsed && <span>{name}</span>}

              {/* Tooltip for collapsed mode */}
              {collapsed && (
                <span className='absolute left-full ml-2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap'>
                  {name}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
