import React from 'react'
import { usePosStore } from '../../store/posStore'
import { ProductCategory } from '../../types'

const CATEGORIES: ProductCategory[] = [
  'Todos',
  'Vestidos',
  'Blusas & Tops',
  'Jeans & Pantalones',
  'Conjuntos'
]

export const CategoryTabs: React.FC = () => {
  const { activeCategory, setActiveCategory, products } = usePosStore()

  // Compute counts per category
  const getCount = (cat: ProductCategory) => {
    if (cat === 'Todos') return products.length
    return products.filter((p) => p.category === cat).length
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none select-none">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat
        const count = getCount(cat)

        return (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95 ${
              isActive
                ? 'bg-[#FFD54F] text-[#1C1917] shadow-warm-sm border border-[#FFE8A1] font-bold'
                : 'bg-white text-stone-600 hover:bg-[#FFE8A1]/40 hover:text-stone-900 border border-stone-200/80'
            }`}
          >
            <span>{cat}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                isActive
                  ? 'bg-stone-900/10 text-stone-900 font-bold'
                  : 'bg-stone-100 text-stone-500'
              }`}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
