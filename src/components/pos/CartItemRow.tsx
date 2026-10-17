import React from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { CartItem } from '../../types'
import { usePosStore } from '../../store/posStore'

interface CartItemRowProps {
  item: CartItem
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { updateCartItemQty, removeFromCart } = usePosStore()

  const itemTotal = item.unitPrice * item.quantity
  const isAtMaxStock = item.quantity >= item.maxStock

  return (
    <div className="py-2.5 flex items-center justify-between gap-3 text-xs">
      {/* Left: Garment info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-stone-900 truncate text-xs">
          {item.name}
        </h4>
        <div className="flex items-center gap-1.5 mt-0.5">
          {/* Color dot */}
          <span
            className="w-2.5 h-2.5 rounded-full border border-stone-300 inline-block shrink-0"
            style={{ backgroundColor: item.color.hex }}
            title={item.color.name}
          />
          <span className="text-[11px] text-stone-500 truncate">
            {item.color.name}
          </span>
          <span className="text-stone-300">·</span>
          {/* Size Pill */}
          <span className="text-[10px] font-bold bg-stone-100 text-stone-700 px-1.5 py-0.2 rounded border border-stone-200">
            Talla {item.size}
          </span>
        </div>
        <div className="text-[11px] text-stone-500 font-mono mt-0.5">
          S/ {item.unitPrice.toFixed(2)} c/u
          {isAtMaxStock && (
            <span className="text-amber-600 font-sans ml-2 text-[10px]">
              (Máx: {item.maxStock})
            </span>
          )}
        </div>
      </div>

      {/* Middle: Quantity controls */}
      <div className="flex items-center gap-1 shrink-0 bg-[#FAF9F5] p-1 rounded-lg border border-stone-200/80">
        <button
          type="button"
          onClick={() => updateCartItemQty(item.cartItemId, -1)}
          className="w-6 h-6 rounded flex items-center justify-center text-stone-600 hover:bg-white hover:text-stone-900 active:scale-90 transition-all"
          title="Disminuir cantidad"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-6 text-center font-bold text-xs font-mono text-stone-900">
          {item.quantity}
        </span>
        <button
          type="button"
          onClick={() => updateCartItemQty(item.cartItemId, 1)}
          disabled={isAtMaxStock}
          className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
            isAtMaxStock
              ? 'text-stone-300 cursor-not-allowed'
              : 'text-stone-600 hover:bg-white hover:text-stone-900 active:scale-90'
          }`}
          title="Aumentar cantidad"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Right: Subtotal & Remove */}
      <div className="text-right shrink-0 min-w-[70px] flex items-center justify-end gap-2">
        <span className="font-extrabold text-stone-900 text-xs font-mono">
          S/ {itemTotal.toFixed(2)}
        </span>
        <button
          type="button"
          onClick={() => removeFromCart(item.cartItemId)}
          className="p-1 text-stone-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
          title="Eliminar prenda"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
