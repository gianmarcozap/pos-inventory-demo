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
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-500 border border-stone-200">
        <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
        Agotado
      </span>
    )
  } else if (currentStock <= product.minStockThreshold) {
    stockBadge = (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-full text-amber-900 bg-[#FFB366]/20 border border-[#FFB366]/40">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FFB366] animate-ping" />
        Crítico: {currentStock}
      </span>
    )
  } else {
    stockBadge = (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-full text-[#4D5B18] bg-[#A3B454]/15 border border-[#A3B454]/30">
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
          ? 'opacity-80 border-stone-200 bg-stone-50/50'
          : 'border-stone-200/80 hover:border-[#FFE8A1] hover:shadow-warm hover:-translate-y-0.5'
      }`}
    >
      {/* Top Graphic Banner with Apparel Icon & Category/Stock */}
      <div className="relative p-2.5 pb-1 bg-[#FFFDF7] flex flex-col items-center border-b border-stone-100">
        {/* Top Badges */}
        <div className="w-full flex items-center justify-between mb-0.5">
          <span className="text-[9px] font-mono uppercase tracking-wider text-stone-400 bg-white/80 px-1 py-0.2 rounded border border-stone-200/60">
            {product.sku}
          </span>
          {stockBadge}
        </div>

        {/* Garment Illustration / Thumbnail */}
        <div className="py-1 transform group-hover:scale-105 transition-transform duration-200">
          <ApparelIcon
            tag={product.imageTag}
            color={selectedColor.hex}
            className="w-14 h-14 drop-shadow-xs"
          />
        </div>

        {/* Color Swatch Dots */}
        <div className="flex items-center gap-1 mt-0.5" onClick={(e) => e.stopPropagation()}>
          {product.colors.map((color) => {
            const isSelected = selectedColor.name === color.name
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColor(color)}
                title={color.name}
                className={`w-3 h-3 rounded-full border transition-all ${
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
      <div className="p-2.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <h3 className="font-bold text-xs text-[#1C1917] leading-tight line-clamp-1 group-hover:text-amber-800 transition-colors" title={product.name}>
            {product.name}
          </h3>
          <p className="text-[10px] text-stone-500 mt-0.5 font-medium truncate">
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
                className={`flex-1 py-0.5 rounded text-[10px] font-bold transition-all ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs ring-1 ring-stone-900'
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
        <div className="pt-1.5 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[9px] text-stone-400 block uppercase font-medium -mb-0.5">Precio</span>
            <span className="text-xs md:text-sm font-extrabold text-[#1C1917] font-mono">
              S/ {product.price.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={currentStock <= 0}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all active:scale-95 shadow-warm-sm ${
              isAddedAnim
                ? 'bg-emerald-600 text-white'
                : currentStock <= 0
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-[#FFD54F] hover:bg-[#FFCA28] text-stone-900 border border-[#FFE8A1]'
            }`}
          >
            {isAddedAnim ? (
              <>
                <Check className="w-3 h-3" />
                <span>Listo</span>
              </>
            ) : currentStock <= 0 ? (
              <span>Sin Stock</span>
            ) : (
              <>
                <Plus className="w-3 h-3 stroke-[2.5]" />
                <span>Agregar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
