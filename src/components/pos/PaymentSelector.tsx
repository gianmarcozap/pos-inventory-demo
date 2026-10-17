import React from 'react'
import { Banknote, QrCode, CreditCard } from 'lucide-react'
import { usePosStore } from '../../store/posStore'
import { PaymentMethod } from '../../types'

export const PaymentSelector: React.FC = () => {
  const { paymentMethod, setPaymentMethod, montoRecibido, setMontoRecibido, getTotals } = usePosStore()
  const { total, vuelto } = getTotals()

  const methods: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { id: 'EFECTIVO', label: 'Efectivo', icon: <Banknote className="w-3.5 h-3.5" /> },
    { id: 'YAPE_PLIN', label: 'Yape / Plin', icon: <QrCode className="w-3.5 h-3.5" /> },
    { id: 'TARJETA', label: 'Tarjeta', icon: <CreditCard className="w-3.5 h-3.5" /> },
  ]

  const handleQuickCash = (amount: number) => {
    setMontoRecibido(amount)
  }

  return (
    <div className="space-y-1.5 select-none">
      {/* Radio Pills */}
      <div className="grid grid-cols-3 gap-1.5">
        {methods.map((m) => {
          const isSelected = paymentMethod === m.id
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setPaymentMethod(m.id)}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
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

      {/* Method specific compact sub-panels */}
      {paymentMethod === 'EFECTIVO' && (
        <div className="p-2 bg-[#FFFDF7] rounded-xl border border-stone-200/90 space-y-1.5">
          {/* Row 1: Paga con & Vuelto side by side */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-1">
              <span className="text-[11px] font-semibold text-stone-600 whitespace-nowrap">Paga con:</span>
              <div className="relative flex-1 max-w-[105px]">
                <span className="absolute left-2 top-1 text-[11px] font-mono font-bold text-stone-400">
                  S/
                </span>
                <input
                  type="number"
                  step="0.50"
                  value={montoRecibido || ''}
                  onChange={(e) => setMontoRecibido(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-full pl-6 pr-1.5 py-0.5 text-right text-xs font-mono font-extrabold bg-white border border-stone-300 rounded-md text-stone-900 focus:outline-none focus:border-stone-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-1 text-right">
              <span className="text-[11px] font-medium text-stone-500">Vuelto:</span>
              <span
                className={`font-mono font-extrabold text-xs ${
                  vuelto > 0
                    ? 'text-[#4D5B18]'
                    : montoRecibido >= total
                    ? 'text-stone-700'
                    : 'text-rose-600 font-bold'
                }`}
              >
                {montoRecibido < total ? 'Falta' : `S/ ${vuelto.toFixed(2)}`}
              </span>
            </div>
          </div>

          {/* Row 2: Quick cash pills */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleQuickCash(total)}
              className="flex-1 py-0.5 text-[10px] font-semibold bg-white hover:bg-stone-100 text-stone-700 rounded border border-stone-200 transition-colors"
            >
              Exacto (S/ {total.toFixed(2)})
            </button>
            {[50, 100, 200].map((bill) => (
              <button
                key={bill}
                type="button"
                onClick={() => handleQuickCash(bill)}
                className={`px-2 py-0.5 text-[10px] font-semibold rounded border transition-colors ${
                  montoRecibido === bill
                    ? 'bg-[#FFD54F] border-[#FFE8A1] text-stone-900 font-bold'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                S/ {bill}
              </button>
            ))}
          </div>
        </div>
      )}

      {paymentMethod === 'YAPE_PLIN' && (
        <div className="p-2 bg-[#FFF7E1] rounded-xl border border-[#FFE8A1] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#742284] text-white flex items-center justify-center font-bold text-[10px]">
              Y
            </div>
            <div>
              <span className="font-bold text-stone-900 text-xs block">Yape / Plin</span>
              <span className="text-[10px] text-stone-500 font-mono">969 123 456 · Divas Sullana</span>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-[#4D5B18] bg-[#A3B454]/20 border border-[#A3B454]/30 px-2 py-0.5 rounded-full">
            QR Activo
          </span>
        </div>
      )}

      {paymentMethod === 'TARJETA' && (
        <div className="p-2 bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-sky-700" />
            <div>
              <span className="font-bold text-stone-900 text-xs block">POS Izipay / Niubiz</span>
              <span className="text-[10px] text-stone-500">Listo para insertar o acercar</span>
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
