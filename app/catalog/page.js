'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Catalog() {
  const [products, setProducts] = useState([])
  const [userProducts, setUserProducts] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session) {
          router.push('/login')
        } else {
          setUser(session.user)
          await fetchData(session.user.id)
          setLoading(false)
        }
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  const fetchData = async (userId) => {
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .order('created_at')

    const { data: userProductsData } = await supabase
      .from('user_products')
      .select('*')
      .eq('user_id', userId)

    setProducts(productsData || [])
    setUserProducts(userProductsData || [])
  }

  const isAdded = (productId) =>
    userProducts.some(up => up.product_id === productId)

  const handleAdd = async (productId) => {
    const { error } = await supabase
      .from('user_products')
      .insert({ user_id: user.id, product_id: productId, quantity: 1 })

    if (!error) {
      setUserProducts([...userProducts, { product_id: productId, quantity: 1 }])
    }
  }

  const handleRemove = async (productId) => {
    const { error } = await supabase
      .from('user_products')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId)

    if (!error) {
      setUserProducts(userProducts.filter(up => up.product_id !== productId))
    }
  }

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
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-black transition">
            Mi inventario
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
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Catálogo</h1>
          <p className="text-gray-400 text-sm">Agrega productos a tu inventario personal</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-40 object-cover bg-gray-50"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-400 mb-4">
                  ${product.price.toLocaleString('es-CL')}
                </p>
                <button
                  onClick={() => isAdded(product.id)
                    ? handleRemove(product.id)
                    : handleAdd(product.id)
                  }
                  className={`w-full py-2 rounded-lg text-sm font-medium transition ${
                    isAdded(product.id)
                      ? 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {isAdded(product.id) ? 'Eliminar' : 'Agregar +'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}