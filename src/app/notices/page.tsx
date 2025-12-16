import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NoticeList } from "@/components/notice"
import { PageLayout } from "@/components/layout"

export const metadata = {
  title: "공지사항 - 바람의 나라",
  description: "바람의 나라 공지사항 및 이벤트",
}

export default async function NoticesPage() {
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

  const notices = await prisma.notice.findMany({
    where: { isPublished: true },
    orderBy: [
      { isPinned: "desc" },
      { createdAt: "desc" },
    ],
    take: 50,
  })

  const formattedNotices = notices.map((notice) => ({
    ...notice,
    createdAt: notice.createdAt.toISOString(),
    updatedAt: notice.updatedAt.toISOString(),
    startDate: notice.startDate?.toISOString() || null,
    endDate: notice.endDate?.toISOString() || null,
  }))

  return (
    <PageLayout>
      <NoticeList notices={formattedNotices} showWriteButton={isAdmin} />
    </PageLayout>
  )
}
