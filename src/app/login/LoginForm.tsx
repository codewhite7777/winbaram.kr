'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

export function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-amber-200">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs text-amber-600 tracking-wider">
            THE KINGDOM OF THE WINDS
          </p>
          <h1 className="text-3xl font-bold text-amber-900 font-serif">
            바람의 나라
          </h1>
          <h2 className="text-lg text-amber-700 mt-2">로그인</h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm text-center">
            로그인 중 오류가 발생했습니다. 다시 시도해주세요.
          </div>
        )}

        {/* Social Login Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-gray-700 font-medium">Google로 로그인</span>
          </button>
        </div>

        {/* Info */}
        <p className="mt-6 text-center text-xs text-amber-600">
          Google 계정으로 간편하게 로그인하세요.<br />
          처음 로그인 시 자동으로 회원가입됩니다.
        </p>
      </div>
    </div>
  )
}
