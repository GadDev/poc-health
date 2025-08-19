import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

// Mock the data hooks used by the page
vi.mock('../api/hooks', () => ({
  usePost: vi.fn(),
  usePostComments: vi.fn(),
  useUser: vi.fn(),
}))

import { PostDetailPage } from './PostDetailPage'
import { usePost, usePostComments, useUser } from '../api/hooks'

describe('PostDetailPage', () => {
  const renderAt = (path: string) =>
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/posts/:id" element={<PostDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

  it('shows a loading state', () => {
    ;(usePost as any).mockReturnValue({ isLoading: true })
    ;(usePostComments as any).mockReturnValue({ data: [] })
    ;(useUser as any).mockReturnValue({ data: undefined })

    renderAt('/posts/1')
    expect(screen.getByText(/chargement/i)).toBeInTheDocument()
  })

  it('shows an error state when post not found', () => {
    ;(usePost as any).mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error('oops'),
      data: undefined,
    })
    ;(usePostComments as any).mockReturnValue({ data: [] })
    ;(useUser as any).mockReturnValue({ data: undefined })

    renderAt('/posts/123')
    expect(screen.getByText(/erreur: oops/i)).toBeInTheDocument()
  })

  it('renders post, author and comments', () => {
    const post = { id: 1, userId: 2, title: 'Hello', body: 'World body' }
    const author = { id: 2, name: 'John Doe', company: { name: 'ACME' }, website: 'example.com' }
    const comments = [
      { id: 10, postId: 1, name: 'Jane', email: 'jane@example.com', body: 'Nice!' },
      { id: 11, postId: 1, name: 'Bob', email: 'bob@example.com', body: 'I agree' },
    ]

    ;(usePost as any).mockReturnValue({ isLoading: false, isError: false, data: post })
    ;(useUser as any).mockReturnValue({ data: author })
    ;(usePostComments as any).mockReturnValue({ data: comments })

    renderAt('/posts/1')

    expect(screen.getByRole('link', { name: /retour/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: post.title })).toBeInTheDocument()
    expect(screen.getByText(post.body)).toBeInTheDocument()
    expect(screen.getByText(/auteur:/i)).toHaveTextContent('Auteur: John Doe — ACME')
    expect(screen.getByRole('link', { name: /example\.com/i })).toBeInTheDocument()
    expect(screen.getByText(/commentaires \(2\)/i)).toBeInTheDocument()
    expect(screen.getByText('Jane')).toBeInTheDocument()
    expect(screen.getByText(/jane@example.com/i)).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText(/bob@example.com/i)).toBeInTheDocument()
  })

  it('renders empty comments state', () => {
    const post = { id: 2, userId: 3, title: 'Post', body: 'Body' }
    ;(usePost as any).mockReturnValue({ isLoading: false, isError: false, data: post })
    ;(useUser as any).mockReturnValue({ data: undefined })
    ;(usePostComments as any).mockReturnValue({ data: [] })

    renderAt('/posts/2')
    expect(screen.getByText(/aucun commentaire/i)).toBeInTheDocument()
  })
})
