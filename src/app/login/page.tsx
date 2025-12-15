import { Suspense } from 'react'
import { LoginForm } from './LoginForm'

function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="text-amber-600">로딩 중...</div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  )
}
