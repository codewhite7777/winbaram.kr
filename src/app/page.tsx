import { Header, Footer, LeftSidebar, RightSidebar, MainContent } from "@/components/layout";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // 최신 공지사항 가져오기
  const notices = await prisma.notice.findMany({
    where: { isPublished: true },
    orderBy: [
      { isPinned: "desc" },
      { createdAt: "desc" },
    ],
    take: 5,
    select: {
      id: true,
      title: true,
      type: true,
      isPinned: true,
      createdAt: true,
    },
  });

  const formattedNotices = notices.map((notice) => ({
    ...notice,
    createdAt: notice.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex max-w-6xl mx-auto w-full">
        <LeftSidebar />
        <MainContent notices={formattedNotices} />
        <RightSidebar />
      </div>

      <Footer />
    </div>
  );
}
