import React, { useState } from 'react'
import {
  ShoppingBag,
  Trash2,
  PauseCircle,
  ArrowRight,
  Tag,
  Loader2
} from 'lucide-react'
import { usePosStore } from '../../store/posStore'
import { CustomerLookup } from './CustomerLookup'
import { CartItemRow } from './CartItemRow'
import { PaymentSelector } from './PaymentSelector'

export const CartSection: React.FC = () => {
  const {
    cart,
    clearCart,
    holdCurrentSale,
    completeCheckout,
    isCheckingOut,
    getTotals,
    discountCode,
    setDiscount,
    setToast
  } = usePosStore()

  const [showPromoInput, setShowPromoInput] = useState(false)
  const [promoInputValue, setPromoInputValue] = useState('')

  const totals = getTotals()

  const handleApplyPromo = () => {
    const code = promoInputValue.trim().toUpperCase()
    if (!code) return

    if (code === 'DIVAS10' || code === 'BOUQUET10') {
      const disc = Number((totals.subtotalBruto * 0.1).toFixed(2))
      setDiscount(disc, code)
      setToast(`Cupón ${code} aplicado (-10%): S/ ${disc.toFixed(2)}`, 'success')
      setShowPromoInput(false)
      setPromoInputValue('')
    } else if (code === 'SULLANA20') {
      const disc = Math.min(20, totals.subtotalBruto)
      setDiscount(disc, code)
      setToast(`Cupón SULLANA20 aplicado (-S/ 20.00)`, 'success')
      setShowPromoInput(false)
      setPromoInputValue('')
    } else {
      setToast(`Cupón inválido: "${code}". Prueba "DIVAS10"`, 'warning')
    }
  }

  const handleRemovePromo = () => {
    setDiscount(0, '')
    setToast('Descuento removido', 'info')
  }

  const handleCheckoutClick = async () => {
    if (cart.length === 0) {
      setToast('Agrega prendas al carrito para cobrar', 'warning')
      return
    }
    await completeCheckout()
  }

  return (
    <section className="w-full lg:w-[35%] h-full bg-white border-l border-stone-200 flex flex-col justify-between overflow-hidden select-none">
      {/* Top Header of Cart */}
      <div className="p-4 border-b border-stone-200 bg-[#FFFDF7] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FFD54F]/20 border border-[#FFE8A1] flex items-center justify-center text-stone-900">
            <ShoppingBag className="w-4 h-4 text-stone-800" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-[#1C1917] tracking-tight">
              Venta Actual
            </h2>
            <p className="text-[11px] text-stone-600 font-medium">
              Terminal de Cobro · Mostrador Sullana
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-[#FFF7E1] text-amber-900 border border-[#FFE8A1]">
            {totals.itemCount} prenda(s)
          </span>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="p-1.5 text-stone-600 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition-colors"
              title="Limpiar Carrito"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Customer Lookup Bar */}
      <div className="p-3 border-b border-stone-100 shrink-0">
        <CustomerLookup />
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto px-4 divide-y divide-stone-100 min-h-[140px]">
        {cart.length > 0 ? (
          cart.map((item) => (
            <CartItemRow key={item.cartItemId} item={item} />
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-600">
            <ShoppingBag className="w-10 h-10 mb-2 text-stone-400 stroke-1" />
            <p className="font-bold text-xs text-stone-800">El carrito está vacío</p>
            <p className="text-[11px] text-stone-600 mt-1 max-w-[200px]">
              Selecciona una prenda del catálogo o escanea un código para comenzar.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Sticky Area: Financial Summary & Checkout Actions */}
      <div className="shrink-0 border-t border-stone-200 bg-[#FFFDF7] p-4 space-y-3 shadow-warm">
        {/* Financial Summary */}
        <div className="space-y-1.5 text-xs text-stone-700">
          <div className="flex justify-between items-center">
            <span className="text-stone-700">Subtotal</span>
            <span className="font-mono text-stone-800 font-semibold">
              S/ {totals.subtotalBruto.toFixed(2)}
            </span>
          </div>

          {/* Discount Row */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-stone-700">Descuento</span>
              {discountCode ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 bg-[#FFB366]/20 text-amber-900 rounded border border-[#FFB366]/40">
                  {discountCode}
                  <button onClick={handleRemovePromo} className="text-stone-600 hover:text-stone-900 ml-0.5">×</button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowPromoInput(!showPromoInput)}
                  className="text-[10px] text-stone-600 hover:text-stone-900 flex items-center gap-0.5 font-medium underline"
                >
                  <Tag className="w-2.5 h-2.5" />
                  <span>+ Cupón</span>
                </button>
              )}
            </div>
            <span className="font-mono font-semibold text-amber-800">
              - S/ {totals.descuento.toFixed(2)}
            </span>
          </div>

          {/* Promo code inline input */}
          {showPromoInput && !discountCode && (
            <div className="flex items-center gap-1 pt-1 pb-1">
              <input
                type="text"
                value={promoInputValue}
                onChange={(e) => setPromoInputValue(e.target.value)}
                placeholder="Código (ej. DIVAS10)..."
                className="flex-1 px-2 py-1 text-xs bg-white border border-stone-200 rounded text-stone-800 focus:outline-none uppercase"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-2 py-1 text-xs font-bold bg-[#FFD54F] text-stone-900 rounded hover:bg-[#FFCA28]"
              >
                Aplicar
              </button>
            </div>
          )}

          {/* IGV 18% */}
          <div className="flex justify-between items-center text-stone-700">
            <span>IGV (18% incluido)</span>
            <span className="font-mono">S/ {totals.igv.toFixed(2)}</span>
          </div>

          {/* Total Prominent */}
          <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
            <span className="font-extrabold text-sm text-[#1C1917] tracking-tight">
              TOTAL A PAGAR
            </span>
            <span className="font-extrabold text-lg text-[#1C1917] font-mono">
              S/ {totals.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="pt-1">
          <PaymentSelector />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {/* Primary Checkout CTA */}
          <button
            type="button"
            onClick={handleCheckoutClick}
            disabled={cart.length === 0 || isCheckingOut}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-warm active:scale-[0.99] ${
              cart.length === 0 || isCheckingOut
                ? 'bg-stone-300 cursor-not-allowed'
                : 'bg-[#2563EB] hover:bg-[#1D4ED8] hover:shadow-warm-lg'
            }`}
          >
            {isCheckingOut ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Procesando Venta...</span>
              </>
            ) : (
              <>
                <span>Cobrar S/ {totals.total.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Secondary Actions: Hold & Cancel */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => holdCurrentSale()}
              disabled={cart.length === 0}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Poner venta en espera para atender a otro cliente"
            >
              <PauseCircle className="w-3.5 h-3.5 text-stone-500" />
              <span>Poner en Espera (Hold)</span>
            </button>

            <button
              type="button"
              onClick={clearCart}
              disabled={cart.length === 0}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-stone-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
