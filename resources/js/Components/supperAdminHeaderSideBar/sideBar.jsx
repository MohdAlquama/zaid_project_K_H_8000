'use client'

import {
  LayoutDashboard,
  BarChart,
  UserPlus,
  Server,
  Settings,
  TicketCheck,
  LogOut,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { usePage, Link } from '@inertiajs/react'
import clsx from 'clsx'

const navItems = [
  { name: 'Dashboard', href: '/supper/dashboard', icon: LayoutDashboard },
  { name: 'Performance', href: '/performance', icon: BarChart },
  { name: 'Add Sub-Admin', href: '/supper/addsubadmin', icon: UserPlus },
  { name: 'API', href: '/api', icon: Server },
  { name: 'API Management', href: '/api-management', icon: Settings },
  { name: 'Permission', href: '/supper/permission', icon: TicketCheck },
]

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { url } = usePage()
  const pathname = url

  return (
    <aside
      className={clsx(
        'fixed top-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 h-full shadow-lg transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}
    >
      <div className="flex items-center justify-between px-4 py-4 bg-indigo-600 text-white">
        <h2 className="font-bold text-lg">Setbiz Admin</h2>
        <button onClick={toggleSidebar} className="md:hidden">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex flex-col mt-4 space-y-1 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-2 rounded-md font-medium',
                isActive
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto px-4 py-4">
        <button
          onClick={() => alert('Logout')}
          className="flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 p-2 rounded-md w-full"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
