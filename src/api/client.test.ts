import { describe, expect, it, vi, beforeEach } from 'vitest'
import { api } from './client'

const originalFetch = globalThis.fetch

beforeEach(() => {
  globalThis.fetch = originalFetch
})

describe('api client', () => {
  it('listPosts calls the /posts endpoint', async () => {
    const mockData = [{ id: 1, userId: 1, title: 'a', body: 'b' }]
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => mockData }) as any

    const posts = await api.listPosts('')
    expect(posts).toEqual(mockData)
    expect(globalThis.fetch).toHaveBeenCalled()
    const url = new URL((globalThis.fetch as any).mock.calls[0][0] as string)
    expect(url.pathname).toContain('/posts')
  })

  it('throws on non-ok response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 }) as any
    await expect(api.getPost(1)).rejects.toThrow(/api error/i)
  })
})
