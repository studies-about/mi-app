import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold tracking-tight">miapp.</h1>
      <p className="text-gray-400 text-sm">Bienvenido</p>
      <div className="flex gap-3">
        <Link
          href="/login"
          className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/register"
          className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          Registrarse
        </Link>
      </div>
    </div>
  )
}