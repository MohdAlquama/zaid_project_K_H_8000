'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  // Load from localStorage on first mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  const toggleTheme = () => {
    const newTheme = dark ? 'light' : 'dark'
    setDark(!dark)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', !dark)
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-indigo-500 dark:hover:bg-gray-700"
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}
