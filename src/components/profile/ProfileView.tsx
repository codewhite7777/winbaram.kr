"use client"

import { useState } from "react"
import Image from "next/image"
import { ProfileEditForm } from "./ProfileEditForm"

type UserProfile = {
  id: string
  email: string
  name: string | null
  nickname: string | null
  image: string | null
  role: string
  createdAt: string
  _count: {
    posts: number
    comments: number
  }
}

type ProfileViewProps = {
  user: UserProfile
}

const roleLabels: Record<string, string> = {
  USER: "일반회원",
  MODERATOR: "운영진",
  ADMIN: "관리자",
  SUPER_ADMIN: "최고관리자",
}

export function ProfileView({ user: initialUser }: ProfileViewProps) {
  const [user, setUser] = useState(initialUser)
  const [isEditing, setIsEditing] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleEditSuccess = (updatedUser: UserProfile) => {
    setUser(updatedUser)
    setIsEditing(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-amber-200 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-amber-50 border-b border-amber-200">
          <h1 className="text-xl font-bold text-amber-900">내 프로필</h1>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {/* Profile Image & Basic Info */}
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "프로필 이미지"}
                  width={100}
                  height={100}
                  className="rounded-full border-2 border-amber-200"
                />
              ) : (
                <div className="w-[100px] h-[100px] rounded-full bg-amber-100 flex items-center justify-center border-2 border-amber-200">
                  <span className="text-3xl text-amber-600">
                    {(user.nickname || user.name || user.email)?.[0]?.toUpperCase() || "?"}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.nickname || user.name || "이름 없음"}
                </h2>
                <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700">
                  {roleLabels[user.role] || user.role}
                </span>
              </div>
              {user.nickname && user.name && (
                <p className="text-gray-600 mb-2">{user.name}</p>
              )}
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-6 border-amber-200" />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-amber-900">{user._count.posts}</p>
              <p className="text-sm text-amber-700">작성한 게시글</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-amber-900">{user._count.comments}</p>
              <p className="text-sm text-amber-700">작성한 댓글</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">닉네임</span>
              <span className="text-gray-900">{user.nickname || "-"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">가입일</span>
              <span className="text-gray-900">{formatDate(user.createdAt)}</span>
            </div>
          </div>

          {/* Edit Button / Form */}
          <div className="mt-6">
            {isEditing ? (
              <ProfileEditForm
                currentNickname={user.nickname}
                onSuccess={handleEditSuccess}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
              >
                프로필 수정
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
