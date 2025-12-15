import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { SearchForm } from "./SearchForm"
import { useRouter, useSearchParams } from "next/navigation"

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  useSearchParams: vi.fn(() => ({
    get: vi.fn(),
  })),
}))

describe("SearchForm", () => {
  const mockPush = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as never)
    vi.mocked(useSearchParams).mockReturnValue({ get: vi.fn() } as never)
  })

  it("검색 폼을 렌더링한다", () => {
    render(<SearchForm />)
    expect(screen.getByPlaceholderText("검색어를 입력하세요")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "검색" })).toBeInTheDocument()
  })

  it("검색어를 입력하고 제출하면 검색 페이지로 이동한다", () => {
    render(<SearchForm />)

    const input = screen.getByPlaceholderText("검색어를 입력하세요")
    fireEvent.change(input, { target: { value: "테스트 검색어" } })

    const button = screen.getByRole("button", { name: "검색" })
    fireEvent.click(button)

    expect(mockPush).toHaveBeenCalledWith("/board/search?q=%ED%85%8C%EC%8A%A4%ED%8A%B8%20%EA%B2%80%EC%83%89%EC%96%B4")
  })

  it("빈 검색어로는 검색하지 않는다", () => {
    render(<SearchForm />)

    const button = screen.getByRole("button", { name: "검색" })
    fireEvent.click(button)

    expect(mockPush).not.toHaveBeenCalled()
  })

  it("기존 검색어가 있으면 입력창에 표시한다", () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn((key) => (key === "q" ? "기존검색어" : null)),
    } as never)

    render(<SearchForm />)

    const input = screen.getByPlaceholderText("검색어를 입력하세요") as HTMLInputElement
    expect(input.value).toBe("기존검색어")
  })
})
