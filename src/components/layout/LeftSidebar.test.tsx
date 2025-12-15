import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LeftSidebar } from './LeftSidebar'

describe('LeftSidebar', () => {
  it('renders navigation menu', () => {
    render(<LeftSidebar />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('renders main menu items based on reference screenshot', () => {
    render(<LeftSidebar />)

    // 스크린샷 기반 메뉴 항목들
    expect(screen.getByText(/바람소개/i)).toBeInTheDocument()
    expect(screen.getByText(/바람하기/i)).toBeInTheDocument()
    expect(screen.getByText(/새소식/i)).toBeInTheDocument()
    expect(screen.getByText(/자료실/i)).toBeInTheDocument()
    expect(screen.getByText(/바람웹진/i)).toBeInTheDocument()
    expect(screen.getByText(/질문과 답/i)).toBeInTheDocument()
  })

  it('renders email subscription section', () => {
    render(<LeftSidebar />)
    expect(screen.getByText(/이메일/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /신청/i })).toBeInTheDocument()
  })

  it('renders as aside element', () => {
    render(<LeftSidebar />)
    expect(screen.getByRole('complementary')).toBeInTheDocument()
  })
})
