import React, { useState } from 'react'
import { UserCheck, Sparkles, X, ChevronDown, Check } from 'lucide-react'
import { usePosStore } from '../../store/posStore'
import { DEFAULT_CUSTOMER, MOCK_CUSTOMERS_DB, simulateDniLookup } from '../../data/mockCustomers'
import { Customer } from '../../types'

export const CustomerLookup: React.FC = () => {
  const { customer, setCustomer, setToast } = usePosStore()
  const [dniInput, setDniInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const isDefault = customer.documentNumber === '00000000'

  const handleAutocompleteDefault = async () => {
    setIsLoading(true)
    const result = await simulateDniLookup('72849102')
    setCustomer(result)
    setDniInput('')
    setIsLoading(false)
    setToast('Cliente autocompletado: María Fernanda Torres', 'success')
  }

  const handleLookup = async (dniToSearch?: string) => {
    const val = (dniToSearch !== undefined ? dniToSearch : dniInput).trim()
    if (!val) return

    setIsLoading(true)
    const result = await simulateDniLookup(val)
    setCustomer(result)
    setDniInput('')
    setIsLoading(false)
    setShowDropdown(false)
    setToast(`Cliente identificado: ${result.name}`, 'success')
  }

  const handleSelectCustomer = (c: Customer) => {
    setCustomer(c)
    setShowDropdown(false)
    setToast(`Cliente seleccionado: ${c.name}`, 'info')
  }

  const handleClear = () => {
    setCustomer({ ...DEFAULT_CUSTOMER })
    setDniInput('')
    setToast('Cliente restablecido a General', 'info')
  }

  return (
    <div className="bg-[#FFFDF7] p-3 rounded-xl border border-stone-200/80 select-none">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[11px] font-bold text-stone-700 flex items-center gap-1.5 uppercase tracking-wider">
          <UserCheck className="w-3.5 h-3.5 text-stone-500" />
          <span>Cliente / Comprobante</span>
        </label>

        {/* Quick simulation button requested in prompt */}
        <button
          type="button"
          onClick={handleAutocompleteDefault}
          disabled={isLoading}
          className="flex items-center gap-1 text-[11px] font-semibold text-amber-900 bg-[#FFF7E1] hover:bg-[#FFE8A1] px-2 py-0.5 rounded-md border border-[#FFE8A1] transition-all active:scale-95"
        >
          <Sparkles className="w-3 h-3 text-amber-600" />
          <span>Autocompletar DNI</span>
        </button>
      </div>

      {isDefault ? (
        <div className="space-y-2">
          <div className="relative flex items-center">
            <input
              type="text"
              value={dniInput}
              onChange={(e) => setDniInput(e.target.value.replace(/\D/g, '').slice(0, 11))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleLookup()
                }
              }}
              placeholder="DNI (8 dígitos) o RUC..."
              className="w-full pl-3 pr-20 py-1.5 text-xs bg-white rounded-lg border border-stone-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-200 font-mono"
            />
            <div className="absolute right-1 flex items-center gap-1">
              {dniInput && (
                <button
                  type="button"
                  onClick={() => handleLookup()}
                  disabled={isLoading}
                  className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded text-[10px] font-bold transition-colors"
                >
                  {isLoading ? '...' : 'Buscar'}
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-1 text-stone-400 hover:text-stone-700"
                title="Clientes frecuentes"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick list of frequent customers */}
          {showDropdown && (
            <div className="bg-white rounded-lg border border-stone-200 shadow-warm p-1 space-y-0.5 text-xs z-10">
              <div className="px-2 py-1 text-[10px] uppercase font-bold text-stone-400">
                Clientes frecuentes en Sullana
              </div>
              {Object.values(MOCK_CUSTOMERS_DB).map((c) => (
                <button
                  key={c.documentNumber}
                  onClick={() => handleSelectCustomer(c)}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-[#FFF7E1] flex items-center justify-between text-stone-800"
                >
                  <div>
                    <span className="font-semibold">{c.name}</span>
                    <span className="text-[10px] text-stone-400 font-mono ml-1.5">
                      {c.documentType} {c.documentNumber}
                    </span>
                  </div>
                  <Check className="w-3 h-3 text-stone-300" />
                </button>
              ))}
            </div>
          )}

          <div className="text-[11px] text-stone-600 flex items-center justify-between px-1">
            <span>Cliente: <strong className="text-stone-700">General / Ocasional</strong></span>
            <span className="font-mono text-[10px] text-stone-600">Boleta sin DNI</span>
          </div>
        </div>
      ) : (
        <div className="bg-white p-2 rounded-lg border border-stone-200/90 flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-stone-900 truncate">
                {customer.name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-stone-600 font-mono">
              <span className="bg-[#FFF7E1] text-amber-900 px-1 py-0.2 rounded font-semibold text-[10px]">
                {customer.documentType} {customer.documentNumber}
              </span>
              {customer.phone && <span>· {customer.phone}</span>}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-100 transition-colors"
            title="Cambiar cliente"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
