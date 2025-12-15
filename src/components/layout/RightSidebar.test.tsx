import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RightSidebar } from './RightSidebar'

describe('RightSidebar', () => {
  it('renders as aside element', () => {
    render(<RightSidebar />)
    expect(screen.getByRole('complementary')).toBeInTheDocument()
  })

  it('renders best screenshot section', () => {
    render(<RightSidebar />)
    expect(screen.getByText(/베스트.*스크린샷/i)).toBeInTheDocument()
  })

  it('renders poll/vote section', () => {
    render(<RightSidebar />)
    expect(screen.getByText(/잠깐투표/i)).toBeInTheDocument()
  })

  it('renders ranking section', () => {
    render(<RightSidebar />)
    expect(screen.getByText(/바람순위/i)).toBeInTheDocument()
  })

  it('renders today fortune section', () => {
    render(<RightSidebar />)
    expect(screen.getByText(/오늘의 운세/i)).toBeInTheDocument()
  })
})
