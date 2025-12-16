import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET /api/user/profile - 현재 사용자 프로필 조회
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      )
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
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...user,
      createdAt: user.createdAt.toISOString(),
    })
  } catch (error) {
    console.error("Failed to fetch profile:", error)
    return NextResponse.json(
      { error: "프로필 조회에 실패했습니다." },
      { status: 500 }
    )
  }
}

// PUT /api/user/profile - 프로필 수정 (닉네임)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { nickname } = body

    // 닉네임 유효성 검사
    if (nickname !== undefined && nickname !== null) {
      const trimmedNickname = nickname.trim()

      if (trimmedNickname.length > 0) {
        if (trimmedNickname.length < 2 || trimmedNickname.length > 20) {
          return NextResponse.json(
            { error: "닉네임은 2자 이상 20자 이하로 입력해주세요." },
            { status: 400 }
          )
        }

        // 중복 체크
        const existingUser = await prisma.user.findUnique({
          where: { nickname: trimmedNickname },
        })

        if (existingUser && existingUser.id !== session.user.id) {
          return NextResponse.json(
            { error: "이미 사용 중인 닉네임입니다." },
            { status: 400 }
          )
        }
      }
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        nickname: nickname?.trim() || null,
      },
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

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("Failed to update profile:", error)
    return NextResponse.json(
      { error: "프로필 수정에 실패했습니다." },
      { status: 500 }
    )
  }
}
