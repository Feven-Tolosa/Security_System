'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ShieldCheckIcon,
  ChatBubbleBottomCenterTextIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

export default function ManagerSidebar() {
  const pathname = usePathname()

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
    <aside className='hidden md:flex flex-col w-64 bg-secondary dark:bg-gray-800 text-white border-r border-gray-700 p-4 space-y-2'>
      {navItems.map(({ name, href, icon: Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={name}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
              active
                ? 'bg-primary text-white font-semibold'
                : 'hover:bg-gray-700 text-gray-200'
            }`}
          >
            <Icon className='h-5 w-5' />
            {name}
          </Link>
        )
      })}
    </aside>
  )
}
