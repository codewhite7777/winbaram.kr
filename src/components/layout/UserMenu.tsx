'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'

export function UserMenu() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-amber-200 rounded-full animate-pulse" />
      </div>
    )
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || '프로필'}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <span className="text-sm text-amber-800">
          {session.user.name || session.user.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="px-3 py-1 text-sm text-amber-600 hover:text-amber-800 transition-colors"
        >
          로그아웃
        </button>
      </div>
    )
  }

  return (
    <nav aria-label="사용자 메뉴" className="flex items-center gap-4">
      <Link
        href="/login"
        className="px-4 py-2 text-sm text-amber-800 hover:text-amber-600 transition-colors"
      >
        로그인
      </Link>
      <Link
        href="/login"
        className="px-4 py-2 text-sm bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
      >
        회원가입
      </Link>
    </nav>
  )
}
