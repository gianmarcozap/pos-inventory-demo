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
    <section className="w-full lg:w-[35%] h-full bg-white border-l border-stone-200 flex flex-col overflow-hidden select-none">
      {/* Top Header of Cart */}
      <div className="px-3.5 py-2 border-b border-stone-200 bg-[#FFFDF7] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FFD54F]/20 border border-[#FFE8A1] flex items-center justify-center text-stone-900">
            <ShoppingBag className="w-3.5 h-3.5 text-stone-800" />
          </div>
          <div>
            <h2 className="font-extrabold text-xs text-[#1C1917] tracking-tight">
              Venta Actual
            </h2>
            <p className="text-[10px] text-stone-500 font-medium -mt-0.5">
              Terminal de Cobro · Mostrador Sullana
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#FFF7E1] text-amber-900 border border-[#FFE8A1]">
            {totals.itemCount} prenda(s)
          </span>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="p-1 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition-colors"
              title="Limpiar Carrito"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Customer Lookup Bar */}
      <div className="p-2 border-b border-stone-100 shrink-0">
        <CustomerLookup />
      </div>

      {/* Cart Items List: Scrollable area with min-h-0 */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3.5 divide-y divide-stone-100">
        {cart.length > 0 ? (
          cart.map((item) => (
            <CartItemRow key={item.cartItemId} item={item} />
          ))
        ) : (
          <div className="h-full min-h-[100px] flex flex-col items-center justify-center text-center p-4 text-stone-400">
            <ShoppingBag className="w-8 h-8 mb-1.5 opacity-40 stroke-1" />
            <p className="font-bold text-xs text-stone-700">El carrito está vacío</p>
            <p className="text-[11px] text-stone-500 mt-0.5 max-w-[200px]">
              Selecciona prendas del catálogo para comenzar la venta.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Sticky Area: Financial Summary, Payment & Checkout */}
      <div className="shrink-0 border-t border-stone-200 bg-[#FFFDF7] p-3 space-y-2.5 shadow-warm">
        {/* Financial Summary */}
        <div className="space-y-1 text-xs">
          {/* Subtotal, Descuento & IGV inline */}
          <div className="flex items-center justify-between text-[11px] text-stone-600">
            <span>
              Subt: <strong className="font-mono text-stone-800">S/ {totals.subtotalBruto.toFixed(2)}</strong>
            </span>
            <span>
              IGV (18%): <strong className="font-mono text-stone-700">S/ {totals.igv.toFixed(2)}</strong>
            </span>
            <div className="flex items-center gap-1">
              {discountCode ? (
                <span className="inline-flex items-center gap-1 font-bold px-1.5 py-0.2 bg-[#FFB366]/20 text-amber-900 rounded border border-[#FFB366]/40 text-[10px]">
                  {discountCode}
                  <button onClick={handleRemovePromo} className="hover:text-stone-900">×</button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowPromoInput(!showPromoInput)}
                  className="text-stone-500 hover:text-stone-800 flex items-center gap-0.5 font-medium underline text-[10px]"
                >
                  <Tag className="w-2.5 h-2.5" />
                  <span>+ Cupón</span>
                </button>
              )}
              {totals.descuento > 0 && (
                <span className="font-mono text-amber-800 font-bold">
                  -S/ {totals.descuento.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Promo code input popup */}
          {showPromoInput && !discountCode && (
            <div className="flex items-center gap-1 py-1">
              <input
                type="text"
                value={promoInputValue}
                onChange={(e) => setPromoInputValue(e.target.value)}
                placeholder="Código (ej. DIVAS10)..."
                className="flex-1 px-2 py-0.5 text-xs bg-white border border-stone-200 rounded text-stone-800 uppercase focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-2 py-0.5 text-xs font-bold bg-[#FFD54F] text-stone-900 rounded hover:bg-[#FFCA28]"
              >
                Aplicar
              </button>
            </div>
          )}

          {/* Total Prominent Banner */}
          <div className="pt-1.5 border-t border-stone-200 flex justify-between items-center">
            <span className="font-extrabold text-xs text-[#1C1917] uppercase tracking-wider">
              Total a Pagar
            </span>
            <span className="font-extrabold text-xl text-[#1C1917] font-mono leading-none">
              S/ {totals.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <PaymentSelector />
        </div>

        {/* Action Buttons: Prominent Checkout CTA */}
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={handleCheckoutClick}
            disabled={cart.length === 0 || isCheckingOut}
            className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-warm active:scale-[0.99] ${
              cart.length === 0 || isCheckingOut
                ? 'bg-stone-300 cursor-not-allowed'
                : 'bg-[#2563EB] hover:bg-[#1D4ED8] hover:shadow-warm-lg ring-2 ring-[#2563EB]/20'
            }`}
          >
            {isCheckingOut ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Procesando Venta...</span>
              </>
            ) : (
              <>
                <span>COBRAR S/ {totals.total.toFixed(2)}</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono font-medium">F4</span>
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
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title="Poner venta en espera para atender a otro cliente"
            >
              <PauseCircle className="w-3.5 h-3.5 text-stone-500" />
              <span>Poner en Espera</span>
            </button>

            <button
              type="button"
              onClick={clearCart}
              disabled={cart.length === 0}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
