import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

function SampleComponent() {
  return <div>Hello Winbaram</div>
}

describe('Test Setup', () => {
  it('should render component correctly', () => {
    render(<SampleComponent />)
    expect(screen.getByText('Hello Winbaram')).toBeInTheDocument()
  })

  it('should run basic assertions', () => {
    expect(1 + 1).toBe(2)
  })
})
