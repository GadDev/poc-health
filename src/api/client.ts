import type { Post, Comment, User } from './types'

const BASE_URL = 'https://jsonplaceholder.typicode.com'

const get = async <T>(path: string, params?: Record<string, string | number | undefined>) => {
  const url = new URL(BASE_URL + path)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v))
    }
  }
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return (await res.json()) as T
}

export const api = {
  listPosts: (title?: string) => get<Post[]>('/posts', title ? { title_like: title } : undefined),
  getPost: (id: number) => get<Post>(`/posts/${id}`),
  getPostComments: (postId: number) => get<Comment[]>(`/posts/${postId}/comments`),
  getUser: (id: number) => get<User>(`/users/${id}`),
}
