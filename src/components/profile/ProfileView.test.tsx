import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { ProfileView } from "./ProfileView"

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}))

const mockUser = {
  id: "user1",
  email: "test@test.com",
  name: "테스터",
  nickname: "tester",
  image: "https://example.com/avatar.jpg",
  role: "USER",
  createdAt: "2024-01-01T00:00:00.000Z",
  _count: {
    posts: 5,
    comments: 10,
  },
}

describe("ProfileView", () => {
  it("renders user profile information", () => {
    render(<ProfileView user={mockUser} />)

    expect(screen.getByText("내 프로필")).toBeInTheDocument()
    expect(screen.getAllByText("tester")).toHaveLength(2) // Header and details
    expect(screen.getByText("test@test.com")).toBeInTheDocument()
    expect(screen.getByText("일반회원")).toBeInTheDocument()
  })

  it("displays post and comment counts", () => {
    render(<ProfileView user={mockUser} />)

    expect(screen.getByText("5")).toBeInTheDocument()
    expect(screen.getByText("작성한 게시글")).toBeInTheDocument()
    expect(screen.getByText("10")).toBeInTheDocument()
    expect(screen.getByText("작성한 댓글")).toBeInTheDocument()
  })

  it("shows profile image when available", () => {
    render(<ProfileView user={mockUser} />)

    const img = screen.getByAltText("테스터")
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg")
  })

  it("shows edit button and switches to edit form when clicked", () => {
    render(<ProfileView user={mockUser} />)

    const editButton = screen.getByText("프로필 수정")
    expect(editButton).toBeInTheDocument()

    fireEvent.click(editButton)

    expect(screen.getByLabelText("닉네임")).toBeInTheDocument()
    expect(screen.getByText("저장")).toBeInTheDocument()
    expect(screen.getByText("취소")).toBeInTheDocument()
  })

  it("displays fallback avatar when no image", () => {
    const userWithoutImage = { ...mockUser, image: null }
    render(<ProfileView user={userWithoutImage} />)

    expect(screen.getByText("T")).toBeInTheDocument() // First letter of nickname
  })

  it("formats join date correctly", () => {
    render(<ProfileView user={mockUser} />)

    expect(screen.getByText("2024년 1월 1일")).toBeInTheDocument()
  })
})
