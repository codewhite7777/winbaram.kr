'use client'

import Link from 'next/link'
import { useState } from 'react'

const menuItems = [
  { href: '/about', label: '바람소개', icon: '🏰' },
  { href: '/play', label: '바람하기', icon: '🎮' },
  { href: '/news', label: '새소식', icon: '📢' },
  { href: '/archive', label: '자료실', icon: '📁' },
  { href: '/webzine', label: '바람웹진', icon: '📰' },
  { href: '/qna', label: '질문과 답', icon: '❓' },
]

export function LeftSidebar() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 이메일 구독 로직
    console.log('Subscribe:', email)
  }

  return (
    <aside className="w-48 bg-amber-50 border-r border-amber-200">
      {/* Main Navigation */}
      <nav className="p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 text-amber-900 hover:bg-amber-100 rounded transition-colors text-sm"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Email Subscription */}
      <div className="p-3 border-t border-amber-200">
        <form onSubmit={handleSubscribe}>
          <label className="block text-xs text-amber-700 mb-1">
            이메일 주소를 입력하세요
          </label>
          <div className="flex gap-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              className="flex-1 px-2 py-1 text-xs border border-amber-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            <button
              type="submit"
              className="px-2 py-1 text-xs bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
            >
              신청
            </button>
          </div>
        </form>
      </div>

      {/* Ad Banners Placeholder */}
      <div className="p-3 border-t border-amber-200 space-y-2">
        <div className="bg-amber-100 h-20 rounded flex items-center justify-center text-xs text-amber-500">
          광고 배너
        </div>
        <div className="bg-amber-100 h-20 rounded flex items-center justify-center text-xs text-amber-500">
          광고 배너
        </div>
      </div>
    </aside>
  )
}
