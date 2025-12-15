"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { CommentForm } from "./CommentForm"

type Comment = {
  id: string
  content: string
  createdAt: string
  author: { id: string; name: string | null; image?: string | null }
  replies?: Comment[]
}

type CommentListProps = {
  comments: Comment[]
  postId: string
  onCommentAdded?: () => void
}

export function CommentList({ comments, postId, onCommentAdded }: CommentListProps) {
  return (
    <div className="bg-white border border-amber-200 rounded mt-4">
      <div className="px-4 py-3 border-b border-amber-200 flex items-center justify-between">
        <h3 className="font-bold text-amber-900">댓글 ({comments.length})</h3>
      </div>

      <div className="p-4">
        <CommentForm postId={postId} onSuccess={onCommentAdded} />

        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            첫 댓글을 작성해보세요!
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={postId}
                onCommentUpdated={onCommentAdded}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

type CommentItemProps = {
  comment: Comment
  postId: string
  isReply?: boolean
  onCommentUpdated?: () => void
}

function CommentItem({ comment, postId, isReply = false, onCommentUpdated }: CommentItemProps) {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const isAuthor = session?.user?.id === comment.author.id

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleEdit = async () => {
    try {
      const res = await fetch(`/api/comments/${comment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      })

      if (res.ok) {
        setIsEditing(false)
        onCommentUpdated?.()
      } else {
        alert("수정에 실패했습니다.")
      }
    } catch {
      alert("오류가 발생했습니다.")
    }
  }

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return

    try {
      const res = await fetch(`/api/comments/${comment.id}`, { method: "DELETE" })
      if (res.ok) {
        onCommentUpdated?.()
      } else {
        alert("삭제에 실패했습니다.")
      }
    } catch {
      alert("오류가 발생했습니다.")
    }
  }

  return (
    <div className={`${isReply ? "ml-8 pl-4 border-l-2 border-amber-100" : ""}`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-sm font-bold">
          {comment.author.name?.[0] || "?"}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{comment.author.name || "익명"}</span>
            <span className="text-gray-400">{formatDate(comment.createdAt)}</span>
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 bg-amber-500 text-white text-sm rounded hover:bg-amber-600"
                >
                  저장
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditContent(comment.content)
                  }}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          )}

          {!isEditing && (
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              {!isReply && session && (
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="hover:text-amber-600"
                >
                  답글
                </button>
              )}
              {isAuthor && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="hover:text-amber-600"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="hover:text-red-500"
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          )}

          {isReplying && (
            <div className="mt-3">
              <CommentForm
                postId={postId}
                parentId={comment.id}
                onSuccess={() => {
                  setIsReplying(false)
                  onCommentUpdated?.()
                }}
                onCancel={() => setIsReplying(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* 대댓글 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              isReply
              onCommentUpdated={onCommentUpdated}
            />
          ))}
        </div>
      )}
    </div>
  )
}
