import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NoticeDetail } from "@/components/notice"
import { PageLayout } from "@/components/layout"

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const notice = await prisma.notice.findUnique({
    where: { id },
    select: { title: true },
  })

  return {
    title: notice ? `${notice.title} - 바람의 나라` : "공지사항 - 바람의 나라",
  }
}

export default async function NoticeDetailPage({ params }: PageProps) {
  const { id } = await params
  const session = await auth()

  // 관리자 여부 확인
  let isAdmin = false
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })
    isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
  }

  const notice = await prisma.notice.findUnique({
    where: { id },
  })

  if (!notice) {
    notFound()
  }

  // 비공개 공지는 관리자만 조회 가능
  if (!notice.isPublished && !isAdmin) {
    notFound()
  }

  const formattedNotice = {
    ...notice,
    createdAt: notice.createdAt.toISOString(),
    updatedAt: notice.updatedAt.toISOString(),
    startDate: notice.startDate?.toISOString() || null,
    endDate: notice.endDate?.toISOString() || null,
  }

  return (
    <PageLayout>
      <NoticeDetail notice={formattedNotice} isAdmin={isAdmin} />
    </PageLayout>
  )
}
