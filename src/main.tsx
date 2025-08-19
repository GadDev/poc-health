import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { PostsPage } from './routes/PostsPage'
import { PostDetailPage } from './routes/PostDetailPage'
import { ErrorBoundary } from './components/ErrorBoundary'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: (
      <ErrorBoundary>
        <div>Oops! An error occurred.</div>
      </ErrorBoundary>
    ),

    children: [
      { index: true, element: <PostsPage /> },
      { path: 'posts/:id', element: <PostDetailPage /> },
    ],
  },
])

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
