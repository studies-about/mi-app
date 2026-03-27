'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* Panel izquierdo — decorativo */}
      <div className="hidden md:flex flex-col justify-between bg-black text-white p-12">
        <div className="text-xl font-bold tracking-tight">miapp.</div>
        <div>
          <p className="text-4xl font-bold leading-tight mb-4">
            Bienvenido<br />de vuelta.
          </p>
          <p className="text-gray-400 text-sm">
            Nos alegra verte otra vez.
          </p>
        </div>
        <p className="text-gray-600 text-xs">© 2025 miapp</p>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-sm">

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Iniciar sesión</h1>
            <p className="text-gray-400 text-sm">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Contraseña</label>
                <span className="text-xs text-gray-400 hover:text-black cursor-pointer transition">
                  ¿Olvidaste tu contraseña?
                </span>
              </div>
              <input
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 mt-2"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión →'}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-gray-400">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-black font-medium hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}