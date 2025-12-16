import { redirect, notFound } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NoticeForm } from "@/components/notice"
import { PageLayout } from "@/components/layout"

type PageProps = {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: "공지사항 수정 - 바람의 나라",
}

export default async function NoticeEditPage({ params }: PageProps) {
  const { id } = await params
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

  const notice = await prisma.notice.findUnique({
    where: { id },
  })

  if (!notice) {
    notFound()
  }

  const formattedNotice = {
    id: notice.id,
    title: notice.title,
    content: notice.content,
    type: notice.type,
    isPinned: notice.isPinned,
    isPublished: notice.isPublished,
    startDate: notice.startDate?.toISOString() || null,
    endDate: notice.endDate?.toISOString() || null,
  }

  return (
    <PageLayout>
      <NoticeForm initialData={formattedNotice} isEdit />
    </PageLayout>
  )
}
