import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { PostList } from "./PostList"

describe("PostList", () => {
  const mockPosts = [
    {
      id: "1",
      title: "테스트 게시글 1",
      slug: "test-1",
      viewCount: 10,
      createdAt: "2024-01-01T00:00:00Z",
      author: { id: "user1", name: "테스터1" },
      category: { id: "cat1", name: "자유게시판", slug: "free" },
      _count: { comments: 5 },
      isNotice: false,
    },
    {
      id: "2",
      title: "공지사항 게시글",
      slug: "notice-1",
      viewCount: 100,
      createdAt: "2024-01-02T00:00:00Z",
      author: { id: "user2", name: "관리자" },
      category: { id: "cat1", name: "자유게시판", slug: "free" },
      _count: { comments: 10 },
      isNotice: true,
    },
  ]

  it("should render post list", () => {
    render(<PostList posts={mockPosts} />)

    expect(screen.getByText("테스트 게시글 1")).toBeInTheDocument()
    expect(screen.getByText("공지사항 게시글")).toBeInTheDocument()
  })

  it("should display author names", () => {
    render(<PostList posts={mockPosts} />)

    expect(screen.getByText("테스터1")).toBeInTheDocument()
    expect(screen.getByText("관리자")).toBeInTheDocument()
  })

  it("should display comment counts", () => {
    render(<PostList posts={mockPosts} />)

    expect(screen.getByText("[5]")).toBeInTheDocument()
    expect(screen.getByText("[10]")).toBeInTheDocument()
  })

  it("should display view counts", () => {
    render(<PostList posts={mockPosts} />)

    expect(screen.getByText("10")).toBeInTheDocument()
    expect(screen.getByText("100")).toBeInTheDocument()
  })

  it("should show notice badge for notice posts", () => {
    render(<PostList posts={mockPosts} />)

    expect(screen.getByText("공지")).toBeInTheDocument()
  })

  it("should show empty message when no posts", () => {
    render(<PostList posts={[]} />)

    expect(screen.getByText("게시글이 없습니다.")).toBeInTheDocument()
  })
})
