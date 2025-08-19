import { Link, Outlet, useNavigation } from 'react-router-dom'

const App = () => {
  const nav = useNavigation()
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold">
            JSONPlaceholder
          </Link>
          <a
            className="text-sm text-blue-600 hover:underline"
            href="https://jsonplaceholder.typicode.com/"
            target="_blank"
            rel="noreferrer"
          >
            API
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-4xl w-full px-4 py-6 flex-1">
        {nav.state === 'loading' ? (
          <div className="text-sm text-gray-500 mb-2">Chargement…</div>
        ) : null}
        <Outlet />
      </main>
      <footer className="mx-auto max-w-4xl w-full px-4 py-6 text-xs text-gray-500">
        Démo React + TypeScript + React Query + Tailwind
      </footer>
    </div>
  )
}

export default App
