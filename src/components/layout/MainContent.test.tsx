import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MainContent } from './MainContent'

describe('MainContent', () => {
  it('renders as main element', () => {
    render(<MainContent />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('renders notice/event section', () => {
    render(<MainContent />)
    expect(screen.getByText(/공지.*이벤트/i)).toBeInTheDocument()
  })

  it('renders baram story section', () => {
    render(<MainContent />)
    expect(screen.getByText(/바람 이야기/i)).toBeInTheDocument()
  })

  it('renders user posts section', () => {
    render(<MainContent />)
    expect(screen.getByText(/유저들의 글모음/i)).toBeInTheDocument()
  })

  it('renders tips/knowhow section', () => {
    render(<MainContent />)
    expect(screen.getByText(/나만의 바람 노하우/i)).toBeInTheDocument()
  })
})
