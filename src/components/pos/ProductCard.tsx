import React, { useState } from 'react'
import { Plus, Check } from 'lucide-react'
import { Product, GarmentSize, ColorSwatch } from '../../types'
import { usePosStore } from '../../store/posStore'
import { ApparelIcon } from '../icons/ApparelIcon'

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = usePosStore()

  // Default to first size with stock, or first size
  const defaultSize = product.sizes.find((s) => s.stock > 0)?.size || product.sizes[0].size
  const [selectedSize, setSelectedSize] = useState<GarmentSize>(defaultSize)
  const [selectedColor, setSelectedColor] = useState<ColorSwatch>(product.colors[0])
  const [isAddedAnim, setIsAddedAnim] = useState(false)

  // Current stock for selected size
  const currentSizeObj = product.sizes.find((s) => s.size === selectedSize)
  const currentStock = currentSizeObj ? currentSizeObj.stock : 0


  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentStock <= 0) return

    const success = addToCart(product, selectedSize, selectedColor, 1)
    if (success) {
      setIsAddedAnim(true)
      setTimeout(() => setIsAddedAnim(false), 500)
    }
  }

  // Stock status styles
  let stockBadge = null
  if (currentStock === 0) {
    stockBadge = (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 border border-stone-200">
        <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
        Agotado
      </span>
    )
  } else if (currentStock <= product.minStockThreshold) {
    stockBadge = (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full text-amber-900 bg-[#FFB366]/20 border border-[#FFB366]/40">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FFB366] animate-ping" />
        Stock Crítico: {currentStock}
      </span>
    )
  } else {
    stockBadge = (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full text-[#4D5B18] bg-[#A3B454]/15 border border-[#A3B454]/30">
        <span className="w-1.5 h-1.5 rounded-full bg-[#A3B454]" />
        Stock: {currentStock}
      </span>
    )
  }

  return (
    <div
      onClick={handleAdd}
      className={`group relative bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer select-none ${
        currentStock === 0
          ? 'opacity-85 border-stone-200 bg-stone-50/50'
          : 'border-stone-200/80 hover:border-[#FFE8A1] hover:shadow-warm hover:-translate-y-0.5'
      }`}
    >
      {/* Top Graphic Banner with Apparel Icon & Category/Stock */}
      <div className="relative p-4 pb-2 bg-[#FFFDF7] flex flex-col items-center border-b border-stone-100">
        {/* Top Badges */}
        <div className="w-full flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 bg-white/80 px-1.5 py-0.5 rounded border border-stone-200/60">
            {product.sku}
          </span>
          {stockBadge}
        </div>

        {/* Garment Illustration / Thumbnail */}
        <div className="py-2 transform group-hover:scale-105 transition-transform duration-200">
          <ApparelIcon
            tag={product.imageTag}
            color={selectedColor.hex}
            className="w-20 h-20 drop-shadow-sm"
          />
        </div>

        {/* Color Swatch Dots */}
        <div className="flex items-center gap-1.5 mt-1" onClick={(e) => e.stopPropagation()}>
          {product.colors.map((color) => {
            const isSelected = selectedColor.name === color.name
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColor(color)}
                title={color.name}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  isSelected
                    ? 'ring-2 ring-stone-800 scale-110 border-white'
                    : 'border-stone-300 hover:scale-110'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            )
          })}
        </div>
      </div>

      {/* Middle: Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          <h3 className="font-bold text-xs md:text-sm text-[#1C1917] leading-snug line-clamp-2 group-hover:text-amber-800 transition-colors">
            {product.name}
          </h3>
          <p className="text-[11px] text-stone-600 mt-0.5 font-medium">
            {selectedColor.name} · Talla {selectedSize}
          </p>
        </div>

        {/* Size Pills */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {product.sizes.map((s) => {
            const isSelected = selectedSize === s.size
            const isAvailable = s.stock > 0

            return (
              <button
                key={s.size}
                type="button"
                disabled={!isAvailable}
                onClick={() => setSelectedSize(s.size)}
                title={`Talla ${s.size}: ${s.stock} disponible(s)`}
                className={`flex-1 py-1 rounded-md text-[11px] font-bold transition-all ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-sm ring-1 ring-stone-900'
                    : isAvailable
                    ? 'bg-stone-100 text-stone-600 hover:bg-[#FFE8A1] hover:text-stone-900'
                    : 'bg-stone-50 text-stone-300 cursor-not-allowed line-through'
                }`}
              >
                {s.size}
              </button>
            )
          })}
        </div>

        {/* Bottom Bar: Price & Add CTA */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-stone-600 block uppercase font-medium">Precio</span>
            <span className="text-sm md:text-base font-extrabold text-[#1C1917]">
              S/ {product.price.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={currentStock <= 0}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-warm-sm ${
              isAddedAnim
                ? 'bg-emerald-600 text-white'
                : currentStock <= 0
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-[#FFD54F] hover:bg-[#FFCA28] text-stone-900 border border-[#FFE8A1]'
            }`}
          >
            {isAddedAnim ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Listo</span>
              </>
            ) : currentStock <= 0 ? (
              <span>Sin Stock</span>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Agregar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
