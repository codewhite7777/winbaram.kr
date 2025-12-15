import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Pagination } from "./Pagination"

describe("Pagination", () => {
  it("현재 페이지 정보를 표시한다", () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />)
    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("이전 버튼이 첫 페이지에서 비활성화된다", () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />)
    const prevButton = screen.getByRole("button", { name: "이전" })
    expect(prevButton).toBeDisabled()
  })

  it("다음 버튼이 마지막 페이지에서 비활성화된다", () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />)
    const nextButton = screen.getByRole("button", { name: "다음" })
    expect(nextButton).toBeDisabled()
  })

  it("페이지 번호 클릭시 onPageChange를 호출한다", () => {
    const onPageChange = vi.fn()
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />)

    fireEvent.click(screen.getByText("3"))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it("이전 버튼 클릭시 이전 페이지로 이동한다", () => {
    const onPageChange = vi.fn()
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />)

    fireEvent.click(screen.getByRole("button", { name: "이전" }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it("다음 버튼 클릭시 다음 페이지로 이동한다", () => {
    const onPageChange = vi.fn()
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />)

    fireEvent.click(screen.getByRole("button", { name: "다음" }))
    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it("현재 페이지가 강조 표시된다", () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />)
    const currentPageButton = screen.getByText("3")
    expect(currentPageButton).toHaveClass("bg-amber-500")
  })

  it("총 페이지가 1이면 페이지네이션을 표시하지 않는다", () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />)
    expect(container.firstChild).toBeNull()
  })
})
