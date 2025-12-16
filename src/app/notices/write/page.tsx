import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NoticeForm } from "@/components/notice"
import { PageLayout } from "@/components/layout"

export const metadata = {
  title: "공지사항 작성 - 바람의 나라",
}

export default async function NoticeWritePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  // 관리자 권한 확인
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    redirect("/notices")
  }

  return (
    <PageLayout>
      <NoticeForm />
    </PageLayout>
  )
}
