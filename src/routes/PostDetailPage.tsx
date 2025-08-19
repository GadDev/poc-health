import { Link, useParams } from 'react-router-dom'
import { usePost, usePostComments, useUser } from '../api/hooks'

export const PostDetailPage = () => {
  const params = useParams()
  const id = Number(params.id)
  const { data: post, isLoading, isError, error } = usePost(Number.isFinite(id) ? id : undefined)
  const { data: comments } = usePostComments(post?.id)
  const { data: author } = useUser(post?.userId)

  if (isLoading) return <div className="text-sm text-gray-500">Chargement…</div>
  if (isError || !post)
    return (
      <div className="text-sm text-red-600">
        Erreur: {(error as Error)?.message ?? 'Post introuvable'}
      </div>
    )

  return (
    <article className="space-y-6">
      <div>
        <Link to="/" className="text-sm text-blue-600 hover:underline">
          ← Retour
        </Link>
      </div>
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
        {author && (
          <div className="text-sm text-gray-600">
            Auteur: <span className="font-medium text-gray-800">{author.name}</span>
            {author.company?.name ? ` — ${author.company.name}` : ''}
            {author.website ? (
              <>
                {' '}
                •{' '}
                <a
                  className="text-blue-600 hover:underline"
                  href={`http://${author.website}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {author.website}
                </a>
              </>
            ) : null}
          </div>
        )}
      </header>

      <p className="whitespace-pre-line text-gray-800">{post.body}</p>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Commentaires ({comments?.length ?? 0})</h2>
        <ul className="divide-y rounded-md border bg-white">
          {comments?.map((c) => (
            <li key={c.id} className="p-4">
              <div className="mb-1 text-sm text-gray-600">
                <span className="font-medium text-gray-800">{c.name}</span> — {c.email}
              </div>
              <p className="text-gray-800 whitespace-pre-line">{c.body}</p>
            </li>
          ))}
          {(comments?.length ?? 0) === 0 && (
            <li className="p-4 text-sm text-gray-500">Aucun commentaire</li>
          )}
        </ul>
      </section>
    </article>
  )
}
