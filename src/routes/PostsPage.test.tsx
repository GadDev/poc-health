import { describe, expect, it, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

describe('PostsPage', () => {
  afterEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('renders a list of posts when data is available', async () => {
    vi.doMock('../api/hooks', () => ({
      usePosts: () => ({
        data: [
          { id: 1, userId: 1, title: 'Foo', body: 'Bar' },
          { id: 2, userId: 1, title: 'Baz', body: 'Qux' },
        ],
        isLoading: false,
        isError: false,
        error: null,
      }),
    }))

    const { PostsPage } = await import('./PostsPage')

    render(
      <MemoryRouter>
        <PostsPage />
      </MemoryRouter>,
    )

    expect(screen.getByPlaceholderText(/rechercher par titre/i)).toBeInTheDocument()
    expect(screen.getByText('Foo')).toBeInTheDocument()
    expect(screen.getByText('Baz')).toBeInTheDocument()
    expect(screen.queryByText(/aucun résultat/i)).not.toBeInTheDocument()
  })

  it('renders empty state when no posts', async () => {
    vi.doMock('../api/hooks', () => ({
      usePosts: () => ({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
      }),
    }))

    const { PostsPage } = await import('./PostsPage')

    render(
      <MemoryRouter>
        <PostsPage />
      </MemoryRouter>,
    )

    expect(screen.getByText(/aucun résultat/i)).toBeInTheDocument()
  })
})
