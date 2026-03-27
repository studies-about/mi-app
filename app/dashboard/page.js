'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session) {
          router.push('/login')
        } else {
          setUser(session.user)
          await fetchInventory(session.user.id)
          setLoading(false)
        }
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  const fetchInventory = async (userId) => {
    const { data } = await supabase
      .from('user_products')
      .select(`
        id,
        quantity,
        products (
          id,
          name,
          price,
          image_url
        )
      `)
      .eq('user_id', userId)

    setInventory(data || [])
  }

  const handleQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return

    const { error } = await supabase
      .from('user_products')
      .update({ quantity: newQuantity })
      .eq('id', itemId)

    if (!error) {
      setInventory(inventory.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ))
    }
  }

  const handleDelete = async (itemId) => {
    const { error } = await supabase
      .from('user_products')
      .delete()
      .eq('id', itemId)

    if (!error) {
      setInventory(inventory.filter(item => item.id !== itemId))
    }
  }

  const total = inventory.reduce((sum, item) =>
    sum + (item.products.price * item.quantity), 0
  )

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <span className="text-lg font-bold tracking-tight">miapp.</span>
        <div className="flex gap-4 items-center">
          <Link href="/catalog" className="text-sm text-gray-400 hover:text-black transition">
            Catálogo
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/login')
            }}
            className="text-sm text-gray-400 hover:text-black transition"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* Contenido */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Mi inventario</h1>
          <p className="text-gray-400 text-sm">{inventory.length} productos agregados</p>
        </div>

        {inventory.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 flex flex-col items-center justify-center text-center gap-3">
            <p className="text-gray-300 text-3xl">📦</p>
            <p className="text-gray-400 text-sm">Tu inventario está vacío</p>
            <Link
              href="/catalog"
              className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition mt-2"
            >
              Ver catálogo →
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 mb-6">
              {inventory.map(item => (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                  <img
                    src={item.products.image_url}
                    alt={item.products.name}
                    className="w-16 h-16 rounded-xl object-cover bg-gray-50"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{item.products.name}</p>
                    <p className="text-gray-400 text-xs">
                      ${item.products.price.toLocaleString('es-CL')} c/u
                    </p>
                  </div>

                  {/* Control de cantidad */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition text-sm font-medium"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition text-sm font-medium"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <p className="text-sm font-semibold text-gray-900 w-20 text-right">
                    ${(item.products.price * item.quantity).toLocaleString('es-CL')}
                  </p>

                  {/* Eliminar */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-gray-200 hover:text-red-400 transition text-lg"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">
                ${total.toLocaleString('es-CL')}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}