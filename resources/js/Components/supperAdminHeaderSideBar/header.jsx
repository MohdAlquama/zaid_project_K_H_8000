// 'use client'

// import { Menu, Bell, Search, Settings } from 'lucide-react'
// import { useState } from 'react'

// export function Header({ toggleSidebar }) {
//   const [searchOpen, setSearchOpen] = useState(false)

//   return (
//     <header className="fixed top-0 left-0 right-0 h-16 bg-indigo-600 text-white z-50 flex items-center justify-between px-4 shadow-md">
//       <div className="flex items-center gap-3">
//         <button
//           onClick={toggleSidebar}
//           className="md:hidden block p-2 rounded-md hover:bg-indigo-500"
//         >
//           <Menu className="h-5 w-5" />
//         </button>
//         <div className="h-8 w-8 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold text-lg">
//           S
//         </div>
//         <h1 className="font-bold text-lg">Setbiz Admin</h1>
//       </div>

//       <div className="flex items-center gap-4">
//         {/* Search */}
//         <div className="relative">
//           <button
//             onClick={() => setSearchOpen(!searchOpen)}
//             className="p-2 hover:bg-indigo-500 rounded-md"
//           >
//             <Search className="h-5 w-5" />
//           </button>
//           {searchOpen && (
//             <input
//               type="text"
//               placeholder="Search..."
//               className="absolute right-0 top-10 w-64 p-2 rounded-md bg-white text-gray-800 shadow-lg"
//             />
//           )}
//         </div>
//         <Bell className="h-5 w-5 hover:text-gray-200" />
//         <Settings className="h-5 w-5 hover:text-gray-200" />
//         <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center font-semibold">
//           SA
//         </div>
//       </div>
//     </header>
//   )
// }
'use client'

import { Bell, Search, Settings } from 'lucide-react'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

export function Header({ toggleSidebar }) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-indigo-600 dark:bg-gray-900 text-white z-50 flex items-center justify-between px-6 shadow-md">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold text-lg">
          S
        </div>
        <span className="text-lg font-bold">Setbiz Admin</span>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 hover:bg-indigo-500 dark:hover:bg-gray-800 rounded-xl transition-all"
          >
            <Search className="w-5 h-5" />
          </button>
          {searchOpen && (
            <input
              type="text"
              placeholder="Search..."
              className="absolute top-10 right-0 w-64 p-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl shadow-md"
            />
          )}
        </div>

        {/* Icons */}
        <button className="p-2 hover:bg-indigo-500 dark:hover:bg-gray-800 rounded-xl">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-indigo-500 dark:hover:bg-gray-800 rounded-xl">
          <Settings className="w-5 h-5" />
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Avatar */}
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-semibold text-sm">
          SA
        </div>
      </div>
    </header>
  )
}
