import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from './Header'

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  signOut: vi.fn(),
}))

describe('Header', () => {
  it('renders the site logo/title', () => {
    render(<Header />)
    expect(screen.getByText(/바람의 나라/i)).toBeInTheDocument()
  })

  it('renders the English subtitle', () => {
    render(<Header />)
    expect(screen.getByText(/THE KINGDOM OF THE WINDS/i)).toBeInTheDocument()
  })

  it('renders login link when not authenticated', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: /로그인/i })).toBeInTheDocument()
  })

  it('renders the header element with correct role', () => {
    render(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('contains navigation for user actions', () => {
    render(<Header />)
    expect(screen.getByLabelText(/사용자 메뉴/i)).toBeInTheDocument()
  })
})
