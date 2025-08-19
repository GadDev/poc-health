import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { api } from './client'
import type { Post, Comment, User } from './types'

export const usePosts = (title?: string) =>
  useQuery<Post[]>({
    queryKey: ['posts', title ?? ''],
    queryFn: () => api.listPosts(title),
    placeholderData: keepPreviousData,
  })

export const usePost = (id?: number) =>
  useQuery<Post>({
    queryKey: ['post', id],
    queryFn: () => api.getPost(id!),
    enabled: !!id,
  })

export const usePostComments = (id?: number) =>
  useQuery<Comment[]>({
    queryKey: ['comments', id],
    queryFn: () => api.getPostComments(id!),
    enabled: !!id,
  })

export const useUser = (id?: number) =>
  useQuery<User>({
    queryKey: ['user', id],
    queryFn: () => api.getUser(id!),
    enabled: !!id,
  })
