import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { CommentForm } from "./CommentForm"

// Mock next-auth
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(() => ({
    data: { user: { id: "user1", name: "TestUser" } },
    status: "authenticated",
  })),
}))

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe("CommentForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("로그인하지 않으면 로그인 안내 메시지를 표시한다", async () => {
    const { useSession } = await import("next-auth/react")
    vi.mocked(useSession).mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
      update: vi.fn(),
    })

    render(<CommentForm postId="post1" />)
    expect(screen.getByText("댓글을 작성하려면 로그인이 필요합니다.")).toBeInTheDocument()
  })

  it("댓글 입력 폼을 렌더링한다", () => {
    render(<CommentForm postId="post1" />)
    expect(screen.getByPlaceholderText("댓글을 입력하세요")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "등록" })).toBeInTheDocument()
  })

  it("댓글을 입력하고 제출할 수 있다", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: "comment1", content: "테스트 댓글" }),
    })

    const onSuccess = vi.fn()
    render(<CommentForm postId="post1" onSuccess={onSuccess} />)

    const textarea = screen.getByPlaceholderText("댓글을 입력하세요")
    fireEvent.change(textarea, { target: { value: "테스트 댓글" } })

    const submitButton = screen.getByRole("button", { name: "등록" })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/posts/post1/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "테스트 댓글" }),
      })
    })

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
    })
  })

  it("대댓글 폼에서 parentId를 전송한다", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: "reply1", content: "대댓글" }),
    })

    const onSuccess = vi.fn()
    render(<CommentForm postId="post1" parentId="parent1" onSuccess={onSuccess} />)

    const textarea = screen.getByPlaceholderText("답글을 입력하세요")
    fireEvent.change(textarea, { target: { value: "대댓글" } })

    const submitButton = screen.getByRole("button", { name: "등록" })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/posts/post1/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "대댓글", parentId: "parent1" }),
      })
    })
  })

  it("취소 버튼 클릭시 onCancel을 호출한다", () => {
    const onCancel = vi.fn()
    render(<CommentForm postId="post1" parentId="parent1" onCancel={onCancel} />)

    const cancelButton = screen.getByRole("button", { name: "취소" })
    fireEvent.click(cancelButton)

    expect(onCancel).toHaveBeenCalled()
  })

  it("제출 실패시 에러 메시지를 표시한다", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "댓글 작성 실패" }),
    })

    render(<CommentForm postId="post1" />)

    const textarea = screen.getByPlaceholderText("댓글을 입력하세요")
    fireEvent.change(textarea, { target: { value: "테스트 댓글" } })

    const submitButton = screen.getByRole("button", { name: "등록" })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("댓글 작성에 실패했습니다.")).toBeInTheDocument()
    })
  })
})
