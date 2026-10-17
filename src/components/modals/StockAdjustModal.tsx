import React, { useState } from 'react'
import { X, Layers, Plus, Minus, Check } from 'lucide-react'
import { usePosStore } from '../../store/posStore'
import { GarmentSize } from '../../types'

export const StockAdjustModal: React.FC = () => {
  const { adjustStockProduct, closeAdjustStock, adjustProductStock } = usePosStore()

  if (!adjustStockProduct) return null

  // State for adjustment
  const [selectedSize, setSelectedSize] = useState<GarmentSize>(adjustStockProduct.sizes[0].size)
  const currentSizeObj = adjustStockProduct.sizes.find((s) => s.size === selectedSize)
  const currentStock = currentSizeObj ? currentSizeObj.stock : 0

  const [newStock, setNewStock] = useState<number>(currentStock)
  const [reason, setReason] = useState<string>('Reposición de mercadería')

  const handleSizeChange = (size: GarmentSize) => {
    setSelectedSize(size)
    const target = adjustStockProduct.sizes.find((s) => s.size === size)
    setNewStock(target ? target.stock : 0)
  }

  const handleDelta = (delta: number) => {
    setNewStock((prev) => Math.max(0, prev + delta))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    adjustProductStock(adjustStockProduct.id, selectedSize, newStock, reason)
  }

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-warm-xl max-w-md w-full max-h-[calc(100vh-1rem)] sm:max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="shrink-0 p-3.5 sm:p-4 bg-[#FFFDF7] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FFD54F]/30 border border-[#FFE8A1] flex items-center justify-center text-stone-900">
              <Layers className="w-4 h-4 text-stone-800" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">Ajustar Stock Físico</h3>
              <p className="text-[11px] text-stone-500 font-medium font-mono">
                {adjustStockProduct.sku} · {adjustStockProduct.name}
              </p>
            </div>
          </div>
          <button
            onClick={closeAdjustStock}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-3.5 text-xs">
          {/* Variant Size Selector */}
          <div>
            <label className="block font-bold text-stone-700 mb-1.5 uppercase text-[10px] tracking-wider">
              1. Selecciona Talla a Modificar
            </label>
            <div className="grid grid-cols-4 gap-2">
              {adjustStockProduct.sizes.map((s) => {
                const isSelected = selectedSize === s.size
                return (
                  <button
                    key={s.size}
                    type="button"
                    onClick={() => handleSizeChange(s.size)}
                    className={`py-2 rounded-xl text-center border font-bold transition-all ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    <div className="text-xs">{s.size}</div>
                    <div
                      className={`text-[10px] font-mono mt-0.5 ${
                        isSelected
                          ? 'text-white/80'
                          : s.stock <= adjustStockProduct.minStockThreshold
                          ? 'text-amber-800 font-bold'
                          : 'text-stone-600'
                      }`}
                    >
                      {s.stock} un.
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* New Stock Counter */}
          <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-stone-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-stone-600">Stock Actual en Sistema:</span>
              <span className="font-mono font-bold text-stone-900">{currentStock} unidades</span>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-stone-200/70">
              <span className="font-bold text-stone-800">Nuevo Stock:</span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleDelta(-1)}
                  className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-100 active:scale-95"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="0"
                  value={newStock}
                  onChange={(e) => setNewStock(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-16 py-1 text-center font-mono font-extrabold text-sm bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-stone-500"
                />
                <button
                  type="button"
                  onClick={() => handleDelta(1)}
                  className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-100 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Increment Pills */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] text-stone-600">Sumar rápido:</span>
              {[+5, +10, +20].map((inc) => (
                <button
                  key={inc}
                  type="button"
                  onClick={() => handleDelta(inc)}
                  className="px-2 py-0.5 rounded bg-white hover:bg-stone-100 text-[10px] font-bold text-stone-700 border border-stone-200"
                >
                  +{inc} un.
                </button>
              ))}
            </div>
          </div>

          {/* Reason Selector */}
          <div>
            <label className="block font-bold text-stone-700 mb-1.5 uppercase text-[10px] tracking-wider">
              2. Motivo del Ajuste
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full py-2 px-3 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-stone-500"
            >
              <option value="Reposición de mercadería">Reposición de mercadería / Llegada de taller</option>
              <option value="Ajuste por conteo físico de inventario">Ajuste por conteo físico de inventario</option>
              <option value="Devolución o cambio de cliente">Devolución o cambio de cliente</option>
              <option value="Ajuste por merma o muestra">Ajuste por merma o exhibición en vitrina</option>
            </select>
          </div>

          {/* Actions */}
          <div className="shrink-0 pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeAdjustStock}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#FFD54F] hover:bg-[#FFCA28] text-stone-900 border border-[#FFE8A1] shadow-warm-sm transition-all active:scale-95"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Guardar Ajuste</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
