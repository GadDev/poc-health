import { Link } from 'react-router-dom'
import { usePosts } from '../api/hooks'

export const PostsPage = () => {
  const { data, isLoading, isError, error } = usePosts()
  return (
    <div className="space-y-4">
      {isLoading && <div className="text-sm text-gray-500">Chargement des posts…</div>}
      {isError && <div className="text-sm text-red-600">Erreur: {(error as Error)?.message}</div>}
      {(data?.length ?? 0) === 0 && !isLoading ? (
        <div className="rounded-md border bg-white p-4 text-sm text-gray-500">Aucun résultat</div>
      ) : (
        <div className="relative h-[70vh] overflow-auto rounded-md border bg-white">
          <div className="relative w-full">
            {data?.map((post) => (
              <div key={post.id} className="p-4 hover:bg-gray-50 border-b">
                <Link to={`/posts/${post.id}`} className="block">
                  <h3 className="font-medium text-gray-900">{post.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{post.body}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
