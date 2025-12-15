import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoginForm } from './LoginForm'

// Mock next-auth signIn
vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}))

describe('LoginForm', () => {
  it('renders login title', () => {
    render(<LoginForm />)
    expect(screen.getByRole('heading', { name: '로그인', level: 2 })).toBeInTheDocument()
  })

  it('renders Google login button', () => {
    render(<LoginForm />)
    expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument()
  })

  it('renders Discord login button', () => {
    render(<LoginForm />)
    expect(screen.getByRole('button', { name: /discord/i })).toBeInTheDocument()
  })

  it('renders site branding', () => {
    render(<LoginForm />)
    expect(screen.getByText(/바람의 나라/i)).toBeInTheDocument()
  })
})
