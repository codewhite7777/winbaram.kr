import { Suspense } from 'react'
import { LoginForm } from './LoginForm'
import { PageLayout } from "@/components/layout"

function LoginLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-amber-600">로딩 중...</div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <PageLayout>
      <Suspense fallback={<LoginLoading />}>
        <LoginForm />
      </Suspense>
    </PageLayout>
  )
}
