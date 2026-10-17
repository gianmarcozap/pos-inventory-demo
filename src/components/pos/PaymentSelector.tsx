import React from 'react'
import { Banknote, QrCode, CreditCard } from 'lucide-react'
import { usePosStore } from '../../store/posStore'
import { PaymentMethod } from '../../types'

export const PaymentSelector: React.FC = () => {
  const { paymentMethod, setPaymentMethod, montoRecibido, setMontoRecibido, getTotals } = usePosStore()
  const { total, vuelto } = getTotals()

  const methods: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { id: 'EFECTIVO', label: 'Efectivo', icon: <Banknote className="w-4 h-4" /> },
    { id: 'YAPE_PLIN', label: 'Yape / Plin', icon: <QrCode className="w-4 h-4" /> },
    { id: 'TARJETA', label: 'Tarjeta', icon: <CreditCard className="w-4 h-4" /> },
  ]

  const handleQuickCash = (amount: number) => {
    setMontoRecibido(amount)
  }

  return (
    <div className="space-y-2 select-none">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
          Método de Pago
        </span>
        {paymentMethod === 'EFECTIVO' && (
          <span className="text-[11px] font-mono text-stone-600">
            Fondo disponible en caja
          </span>
        )}
      </div>

      {/* Radio Pills */}
      <div className="grid grid-cols-3 gap-1.5">
        {methods.map((m) => {
          const isSelected = paymentMethod === m.id
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setPaymentMethod(m.id)}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-stone-900 text-white shadow-warm-sm ring-1 ring-stone-900'
                  : 'bg-white text-stone-600 hover:bg-[#FFE8A1]/40 hover:text-stone-900 border border-stone-200'
              }`}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          )
        })}
      </div>

      {/* Method specific sub-panels */}
      {paymentMethod === 'EFECTIVO' && (
        <div className="p-2.5 bg-[#FFFDF7] rounded-xl border border-stone-200/90 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-stone-700">Paga con:</span>
            <div className="relative flex-1 max-w-[130px]">
              <span className="absolute left-2.5 top-1.5 text-xs font-mono font-bold text-stone-400">
                S/
              </span>
              <input
                type="number"
                step="0.50"
                value={montoRecibido || ''}
                onChange={(e) => setMontoRecibido(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="w-full pl-7 pr-2 py-1 text-right text-xs font-mono font-extrabold bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-stone-500"
              />
            </div>
          </div>

          {/* Quick cash pills */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickCash(total)}
              className="flex-1 py-1 text-[11px] font-semibold bg-white hover:bg-stone-100 text-stone-700 rounded border border-stone-200 transition-colors"
            >
              Exacto (S/ {total.toFixed(2)})
            </button>
            {[50, 100, 200].map((bill) => (
              <button
                key={bill}
                type="button"
                onClick={() => handleQuickCash(bill)}
                className={`px-2 py-1 text-[11px] font-semibold rounded border transition-colors ${
                  montoRecibido === bill
                    ? 'bg-[#FFD54F] border-[#FFE8A1] text-stone-900 font-bold'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                S/ {bill}
              </button>
            ))}
          </div>

          {/* Vuelto / Change calculation */}
          <div className="flex items-center justify-between pt-1 border-t border-stone-200/60 text-xs">
            <span className="font-semibold text-stone-600">Vuelto a entregar:</span>
            <span
              className={`font-mono font-extrabold text-sm ${
                vuelto > 0 ? 'text-[#4D5B18]' : montoRecibido >= total ? 'text-stone-700' : 'text-rose-600'
              }`}
            >
              {montoRecibido < total ? 'Falta dinero' : `S/ ${vuelto.toFixed(2)}`}
            </span>
          </div>
        </div>
      )}

      {paymentMethod === 'YAPE_PLIN' && (
        <div className="p-2.5 bg-[#FFF7E1] rounded-xl border border-[#FFE8A1] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#742284] text-white flex items-center justify-center font-bold text-xs">
              Y
            </div>
            <div>
              <span className="font-bold text-stone-900 block">Yape / Plin Comercial</span>
              <span className="text-[11px] text-stone-600 font-mono">969 123 456 · Divas Sullana</span>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-[#4D5B18] bg-[#A3B454]/20 border border-[#A3B454]/30 px-2 py-0.5 rounded-full">
            QR Activo
          </span>
        </div>
      )}

      {paymentMethod === 'TARJETA' && (
        <div className="p-2.5 bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-sky-700" />
            <div>
              <span className="font-bold text-stone-900 block">POS Izipay / Niubiz</span>
              <span className="text-[11px] text-stone-600">Visa · Mastercard · Amex</span>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-sky-800 bg-sky-100 border border-sky-300 px-2 py-0.5 rounded-full">
            Conectado
          </span>
        </div>
      )}
    </div>
  )
}
