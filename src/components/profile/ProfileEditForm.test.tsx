import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { ProfileEditForm } from "./ProfileEditForm"

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe("ProfileEditForm", () => {
  const mockOnSuccess = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders form with current nickname", () => {
    render(
      <ProfileEditForm
        currentNickname="tester"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    )

    const input = screen.getByLabelText("닉네임")
    expect(input).toHaveValue("tester")
  })

  it("renders empty input when no nickname", () => {
    render(
      <ProfileEditForm
        currentNickname={null}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    )

    const input = screen.getByLabelText("닉네임")
    expect(input).toHaveValue("")
  })

  it("calls onCancel when cancel button is clicked", () => {
    render(
      <ProfileEditForm
        currentNickname="tester"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    )

    fireEvent.click(screen.getByText("취소"))
    expect(mockOnCancel).toHaveBeenCalled()
  })

  it("shows error when nickname is too short", async () => {
    render(
      <ProfileEditForm
        currentNickname="tester"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    )

    const input = screen.getByLabelText("닉네임")
    fireEvent.change(input, { target: { value: "a" } })
    fireEvent.click(screen.getByText("저장"))

    expect(screen.getByText("닉네임은 2자 이상 20자 이하로 입력해주세요.")).toBeInTheDocument()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it("submits form successfully", async () => {
    const mockUser = {
      id: "user1",
      email: "test@test.com",
      name: "테스터",
      nickname: "newnick",
      image: null,
      role: "USER",
      createdAt: "2024-01-01",
      _count: { posts: 0, comments: 0 },
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, user: mockUser }),
    })

    render(
      <ProfileEditForm
        currentNickname="tester"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    )

    const input = screen.getByLabelText("닉네임")
    fireEvent.change(input, { target: { value: "newnick" } })
    fireEvent.click(screen.getByText("저장"))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: "newnick" }),
      })
      expect(mockOnSuccess).toHaveBeenCalledWith(mockUser)
    })
  })

  it("shows error message from server", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "이미 사용 중인 닉네임입니다." }),
    })

    render(
      <ProfileEditForm
        currentNickname="tester"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    )

    const input = screen.getByLabelText("닉네임")
    fireEvent.change(input, { target: { value: "taken" } })
    fireEvent.click(screen.getByText("저장"))

    await waitFor(() => {
      expect(screen.getByText("이미 사용 중인 닉네임입니다.")).toBeInTheDocument()
    })
    expect(mockOnSuccess).not.toHaveBeenCalled()
  })

  it("disables form during submission", async () => {
    mockFetch.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )

    render(
      <ProfileEditForm
        currentNickname="tester"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    )

    const input = screen.getByLabelText("닉네임")
    fireEvent.change(input, { target: { value: "newnick" } })
    fireEvent.click(screen.getByText("저장"))

    expect(screen.getByText("저장 중...")).toBeInTheDocument()
    expect(input).toBeDisabled()
  })
})
