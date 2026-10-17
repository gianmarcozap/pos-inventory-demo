import React from 'react'
import { SearchBar } from './SearchBar'
import { CategoryTabs } from './CategoryTabs'
import { ProductCard } from './ProductCard'
import { usePosStore } from '../../store/posStore'
import { ShoppingBag } from 'lucide-react'

export const CatalogSection: React.FC = () => {
  const { products, activeCategory, searchQuery } = usePosStore()

  // Filter products by category and search
  const filteredProducts = products.filter((product) => {
    // Category match
    const matchesCategory =
      activeCategory === 'Todos' || product.category === activeCategory

    // Search query match (name, sku, barcode, description)
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      product.name.toLowerCase().includes(q) ||
      product.sku.toLowerCase().includes(q) ||
      product.barcode.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q)

    return matchesCategory && matchesSearch
  })

  return (
    <section className="w-full lg:w-[65%] h-full flex flex-col overflow-hidden p-5 bg-[#FAF9F5]">
      {/* Search & Scanner */}
      <div className="shrink-0 mb-3">
        <SearchBar />
      </div>

      {/* Category Pills Filter */}
      <div className="shrink-0 mb-3">
        <CategoryTabs />
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5 pb-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl border border-stone-200/80 my-8">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-stone-800 text-sm">No se encontraron prendas</h4>
            <p className="text-xs text-stone-500 mt-1 max-w-sm">
              No hay productos que coincidan con la búsqueda "{searchQuery}" en la categoría "{activeCategory}".
            </p>
          </div>
        )}
      </div>

      {/* Subtle catalog footer info */}
      <div className="shrink-0 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-600">
        <span>
          Mostrando <strong>{filteredProducts.length}</strong> de {products.length} prendas
        </span>
        <span className="flex items-center gap-1 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Precios incluyen IGV (18%)
        </span>
      </div>
    </section>
  )
}
