import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ProfileView } from "@/components/profile"

export const metadata = {
  title: "내 프로필 - 바람의 나라",
  description: "바람의 나라 커뮤니티 프로필 관리",
}

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      nickname: true,
      image: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
          comments: true,
        },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4">
      <ProfileView
        user={{
          ...user,
          createdAt: user.createdAt.toISOString(),
        }}
      />
    </div>
  )
}
