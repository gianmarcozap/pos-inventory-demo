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
    <div className="bg-[#FFFDF7] p-2 rounded-xl border border-stone-200/80 select-none">
      <div className="flex items-center justify-between mb-1">
        <label className="text-[10px] font-bold text-stone-600 flex items-center gap-1 uppercase tracking-wider">
          <UserCheck className="w-3 h-3 text-stone-400" />
          <span>Cliente</span>
        </label>

        {/* Quick simulation button */}
        <button
          type="button"
          onClick={handleAutocompleteDefault}
          disabled={isLoading}
          className="flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-[#FFF7E1] hover:bg-[#FFE8A1] px-2 py-0.5 rounded-md border border-[#FFE8A1] transition-all active:scale-95"
          title="Autocompletar con DNI 72849102"
        >
          <Sparkles className="w-2.5 h-2.5 text-amber-600" />
          <span>Autocompletar DNI</span>
        </button>
      </div>

      {isDefault ? (
        <div className="relative">
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
              className="w-full pl-2.5 pr-16 py-1 text-xs bg-white rounded-lg border border-stone-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-400 font-mono"
            />
            <div className="absolute right-1 flex items-center gap-0.5">
              {dniInput && (
                <button
                  type="button"
                  onClick={() => handleLookup()}
                  disabled={isLoading}
                  className="px-1.5 py-0.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-[9px] font-bold transition-colors"
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
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick list of frequent customers */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-stone-200 shadow-warm p-1 space-y-0.5 text-xs z-20">
              <div className="px-2 py-0.5 text-[9px] uppercase font-bold text-stone-400">
                Clientes frecuentes
              </div>
              {Object.values(MOCK_CUSTOMERS_DB).map((c) => (
                <button
                  key={c.documentNumber}
                  onClick={() => handleSelectCustomer(c)}
                  className="w-full text-left px-2 py-1 rounded hover:bg-[#FFF7E1] flex items-center justify-between text-stone-800"
                >
                  <div>
                    <span className="font-semibold text-xs">{c.name}</span>
                    <span className="text-[10px] text-stone-400 font-mono ml-1">
                      {c.documentType} {c.documentNumber}
                    </span>
                  </div>
                  <Check className="w-3 h-3 text-stone-300" />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white px-2 py-1 rounded-lg border border-stone-200/90 flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-1">
            <span className="text-xs font-bold text-stone-900 truncate block">
              {customer.name}
            </span>
            <span className="text-[10px] text-stone-500 font-mono">
              {customer.documentType} {customer.documentNumber}
            </span>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-100 transition-colors"
            title="Cambiar cliente"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
