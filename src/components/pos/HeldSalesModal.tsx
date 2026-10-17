import React from 'react'
import { X, PlayCircle, Trash2, Clock, ShoppingBag } from 'lucide-react'
import { usePosStore } from '../../store/posStore'

export const HeldSalesModal: React.FC = () => {
  const {
    heldSales,
    isHeldSalesModalOpen,
    setIsHeldSalesModalOpen,
    resumeHeldSale,
    discardHeldSale
  } = usePosStore()

  if (!isHeldSalesModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-warm-xl max-w-md w-full overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-[#FFFDF7] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FFB366]/20 border border-[#FFB366]/40 flex items-center justify-center text-amber-800">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">Ventas en Espera</h3>
              <p className="text-[11px] text-stone-500 font-medium">
                {heldSales.length} ticket(s) retenidos temporalmente
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsHeldSalesModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {heldSales.length === 0 ? (
            <div className="text-center py-8 text-stone-400">
              <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-medium">No hay ventas puestas en espera</p>
            </div>
          ) : (
            heldSales.map((sale) => {
              const totalAmount = sale.items.reduce(
                (acc, item) => acc + item.unitPrice * item.quantity,
                0
              ) - sale.discount

              return (
                <div
                  key={sale.id}
                  className="bg-[#FAF9F5] p-3 rounded-xl border border-stone-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-stone-900">
                        {sale.customer.name}
                      </span>
                      <div className="text-[10px] text-stone-500 font-mono">
                        {new Date(sale.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} · {sale.items.length} prenda(s)
                      </div>
                    </div>
                    <span className="font-bold font-mono text-sm text-stone-900">
                      S/ {totalAmount.toFixed(2)}
                    </span>
                  </div>

                  {/* List preview of items in hold */}
                  <div className="text-[11px] text-stone-600 space-y-0.5 border-t border-stone-200/60 pt-1.5">
                    {sale.items.map((i) => (
                      <div key={i.cartItemId} className="flex justify-between">
                        <span className="truncate pr-2">
                          {i.quantity}x {i.name} ({i.size})
                        </span>
                        <span className="font-mono text-stone-700 shrink-0">
                          S/ {(i.unitPrice * i.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-stone-200/60">
                    <button
                      onClick={() => resumeHeldSale(sale.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-[#FFD54F] hover:bg-[#FFCA28] text-stone-900 rounded-lg text-xs font-bold transition-all border border-[#FFE8A1]"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Reanudar Venta</span>
                    </button>
                    <button
                      onClick={() => discardHeldSale(sale.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Descartar esta venta retenida"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
