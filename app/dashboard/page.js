'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          router.push('/login')
        } else {
          setUser(session.user)
        }
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Cargando...</p>
      </div>
    </div>
  )

  const inicial = user.email[0].toUpperCase()
  const fechaRegistro = new Date(user.created_at).toLocaleDateString('es-CL', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <span className="text-lg font-bold tracking-tight">miapp.</span>
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.push('/login')
          }}
          className="text-sm text-gray-400 hover:text-black transition"
        >
          Cerrar sesión
        </button>
      </nav>

      {/* Contenido */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        
        {/* Saludo */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Hola 👋</h1>
          <p className="text-gray-400 text-sm">Bienvenido a tu espacio personal</p>
        </div>

        {/* Card de perfil */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold">
              {inicial}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user.email}</p>
              <p className="text-xs text-gray-400">Cuenta activa</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center py-3 border-t border-gray-50">
              <span className="text-sm text-gray-400">ID de usuario</span>
              <span className="text-sm font-mono text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
                {user.id.slice(0, 8)}...
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-t border-gray-50">
              <span className="text-sm text-gray-400">Miembro desde</span>
              <span className="text-sm text-gray-600">{fechaRegistro}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-t border-gray-50">
              <span className="text-sm text-gray-400">Plan</span>
              <span className="text-xs font-medium bg-black text-white px-3 py-1 rounded-full">
                Gratuito
              </span>
            </div>
          </div>
        </div>

        {/* Card placeholder */}
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-center gap-2">
          <p className="text-gray-300 text-2xl">+</p>
          <p className="text-sm text-gray-400">Aquí irá el contenido de tu app</p>
        </div>

      </div>
    </div>
  )
}