import Link from 'next/link'
import { UserMenu } from './UserMenu'

export function Header() {
  return (
    <header className="bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 border-b-2 border-amber-300">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex flex-col">
              <span className="text-xs text-amber-700 tracking-wider">
                THE KINGDOM OF THE WINDS
              </span>
              <h1 className="text-3xl font-bold text-amber-900 font-serif">
                바람의 나라
              </h1>
            </Link>
          </div>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
