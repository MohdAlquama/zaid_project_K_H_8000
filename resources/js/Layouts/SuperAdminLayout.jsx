// // import React from 'react';
// // import Sidebar from '@/components/supperAdminHeaderSideBar/sideBar';

// // export default function SupperAdminLayout({ children }) {
// //   return (
// //     <div className="h-screen flex flex-col overflow-hidden">
// //       {/* Optional Fixed Header at Top */}
// //       {/* <Header /> */}

// //       {/* Main content area */}
// //       <div className="flex flex-1 overflow-hidden">
// //         {/* Sidebar */}
// //         <Sidebar />

// //         {/* Main content */}
// //         <main className="flex-1 ml-0 md:ml-64 h-[calc(100vh-4rem)] overflow-y-auto p-6">
// //           {children}
// //         </main>
// //       </div>
// //     </div>
// //   );
// // }
// //layouts/SupperAdminLayout.jsx
// // import { Header } from '@/components/supperAdminHeaderSideBar/header'
// // import Sidebar from '@/components/supperAdminHeaderSideBar/sideBar'
// // import React from 'react'


// // export default function SupperAdminLayout({ children }) {
// //   return (
// //     <div className="h-screen flex flex-col overflow-hidden">
// //       {/* Fixed Header */}
// //       <Header />

// //       {/* Main content area */}
// //       <div className="flex flex-1 overflow-hidden">
// //         {/* Sidebar */}
// //         <Sidebar />

// //         {/* Main content */}
// //         <main className="flex-1 ml-0 md:ml-64 h-[calc(100vh-4rem)] overflow-y-auto p-6 mt-16">
// //           {children}
// //         </main>
// //       </div>
// //     </div>
// //   )
// // }


// 'use client'

// import { Header } from '@/components/supperAdminHeaderSideBar/header'
// import Sidebar from '@/components/supperAdminHeaderSideBar/sideBar'
// import React, { useState } from 'react'


// export default function SupperAdminLayout({ children }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen)
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <Header toggleSidebar={toggleSidebar} />
//       <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
//       <main className="pt-16 md:ml-64 transition-all duration-300 p-6">
//         {children}
//       </main>
//     </div>
//   )
// }





import { Header } from '@/Components/supperAdminHeaderSideBar/header'
import Sidebar from '@/Components/supperAdminHeaderSideBar/sideBar'
import React, { useState } from 'react'

export default function SuperAdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <main className="pt-16 md:ml-64 p-6 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
