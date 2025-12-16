"use client"

import { useState } from "react"

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

type ProfileEditFormProps = {
  currentNickname: string | null
  onSuccess: (user: UserProfile) => void
  onCancel: () => void
}

export function ProfileEditForm({ currentNickname, onSuccess, onCancel }: ProfileEditFormProps) {
  const [nickname, setNickname] = useState(currentNickname || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const trimmedNickname = nickname.trim()

    // Client-side validation
    if (trimmedNickname.length > 0 && (trimmedNickname.length < 2 || trimmedNickname.length > 20)) {
      setError("닉네임은 2자 이상 20자 이하로 입력해주세요.")
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: trimmedNickname }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "프로필 수정에 실패했습니다.")
      }

      onSuccess(data.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
          닉네임
        </label>
        <input
          type="text"
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임을 입력하세요 (2-20자)"
          maxLength={20}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
          disabled={isSubmitting}
        />
        <p className="mt-1 text-xs text-gray-500">
          닉네임은 다른 사용자에게 표시됩니다. 비워두면 Google 계정 이름이 사용됩니다.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "저장 중..." : "저장"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          취소
        </button>
      </div>
    </form>
  )
}
