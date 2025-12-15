import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-amber-100 border-t-2 border-amber-300 py-4">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Links */}
          <nav className="flex items-center gap-4 text-xs text-amber-700">
            <Link href="/about" className="hover:text-amber-900">
              사이트 소개
            </Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-amber-900">
              이용약관
            </Link>
            <span>|</span>
            <Link href="/privacy" className="hover:text-amber-900">
              개인정보처리방침
            </Link>
            <span>|</span>
            <Link href="/contact" className="hover:text-amber-900">
              문의하기
            </Link>
          </nav>

          {/* Copyright */}
          <div className="text-xs text-amber-600 text-center">
            <p>바람의 나라 - The Kingdom of the Winds</p>
            <p>Copyright &copy; {new Date().getFullYear()} Winbaram.kr All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
