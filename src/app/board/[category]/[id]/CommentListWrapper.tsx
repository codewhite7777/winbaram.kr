"use client"

import { useState, useCallback } from "react"
import { CommentList } from "@/components/board"

type CommentInput = {
  id: string
  content: string
  createdAt: Date | string
  author: { id: string; name: string | null; image?: string | null }
  replies?: CommentInput[]
}

type CommentOutput = {
  id: string
  content: string
  createdAt: string
  author: { id: string; name: string | null; image?: string | null }
  replies?: CommentOutput[]
}

type CommentListWrapperProps = {
  postId: string
  initialComments: CommentInput[]
}

export function CommentListWrapper({ postId, initialComments }: CommentListWrapperProps) {
  const [comments, setComments] = useState(initialComments)

  const refreshComments = useCallback(async () => {
    const res = await fetch(`/api/posts/${postId}/comments`)
    if (res.ok) {
      const data = await res.json()
      setComments(data)
    }
  }, [postId])

  // Date를 string으로 변환하는 재귀 함수
  const formatComment = (comment: CommentInput): CommentOutput => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt instanceof Date ? comment.createdAt.toISOString() : String(comment.createdAt),
    author: comment.author,
    replies: comment.replies?.map(formatComment),
  })

  const formattedComments = comments.map(formatComment)

  return <CommentList comments={formattedComments} postId={postId} onCommentAdded={refreshComments} />
}
