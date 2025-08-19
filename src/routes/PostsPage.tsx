import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePosts } from '../api/hooks'
import { useVirtualizer } from '@tanstack/react-virtual'

const useDebounce = <T,>(value: T, delay = 300) => {
  const [debounced, setDebounced] = useState(value)
  // simple debounce without timers across renders using setTimeout
  useMemo(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

export const PostsPage = () => {
  const [search, setSearch] = useState('')
  const debounced = useDebounce(search, 300)
  const { data, isLoading, isError, error } = usePosts(debounced)
  const parentRef = useRef<HTMLDivElement | null>(null)

  const rowVirtualizer = useVirtualizer({
    count: data?.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // rough average row height
    overscan: 6,
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par titre…"
          className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Recherche par titre"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-sm text-gray-600 hover:text-gray-900"
            aria-label="Effacer la recherche"
          >
            Effacer
          </button>
        )}
      </div>

      {isLoading && <div className="text-sm text-gray-500">Chargement des posts…</div>}
      {isError && <div className="text-sm text-red-600">Erreur: {(error as Error)?.message}</div>}

      {/* Virtualized list with graceful fallback */}
      {(data?.length ?? 0) === 0 && !isLoading ? (
        <div className="rounded-md border bg-white p-4 text-sm text-gray-500">Aucun résultat</div>
      ) : (
        <div ref={parentRef} className="relative h-[70vh] overflow-auto rounded-md border bg-white">
          <div className="relative w-full" style={{ height: rowVirtualizer.getTotalSize() }}>
            {parentRef.current
              ? rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const post = data![virtualRow.index]
                  return (
                    <div
                      key={post.id}
                      className="absolute left-0 right-0"
                      style={{
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <div className="p-4 hover:bg-gray-50 border-b">
                        <Link to={`/posts/${post.id}`} className="block">
                          <h3 className="font-medium text-gray-900">{post.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{post.body}</p>
                        </Link>
                      </div>
                    </div>
                  )
                })
              : // Fallback: simple list when ref not ready (e.g., in tests)
                data?.map((post) => (
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
