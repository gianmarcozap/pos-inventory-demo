import React from 'react'
import {
  Store,
  Layers,
  ReceiptText,
  RotateCcw,
  Sparkles,
  Coins,
  PauseCircle,
  HelpCircle
} from 'lucide-react'
import { usePosStore } from '../store/posStore'
import { ActiveTab } from '../types'

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    getCajaSummary,
    heldSales,
    setIsHeldSalesModalOpen,
    resetAllData,
    products
  } = usePosStore()

  const caja = getCajaSummary()

  // Calculate low stock items count for badge in Inventario tab
  const lowStockCount = products.reduce((count, prod) => {
    const hasLowStockVariant = prod.sizes.some((s) => s.stock <= prod.minStockThreshold)
    return hasLowStockVariant ? count + 1 : count
  }, 0)

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }[] = [
    {
      id: 'pos',
      label: 'Terminal POS',
      icon: <Store className="w-4 h-4" />
    },
    {
      id: 'inventario',
      label: 'Inventario & Stock',
      icon: <Layers className="w-4 h-4" />,
      badge: lowStockCount > 0 ? `${lowStockCount} alertas` : undefined,
      badgeColor: 'bg-[#FFB366]/20 text-amber-900 border-[#FFB366]/50'
    },
    {
      id: 'ventas',
      label: 'Historial de Ventas',
      icon: <ReceiptText className="w-4 h-4" />,
      badge: caja.totalTransacciones > 0 ? caja.totalTransacciones : undefined,
      badgeColor: 'bg-stone-100 text-stone-700 border-stone-200'
    }
  ]

  return (
    <header className="h-14 bg-white border-b border-stone-200 px-6 flex items-center justify-between select-none z-20 shrink-0">
      {/* Left: Brand Identity & Navigation Tabs */}
      <div className="flex items-center gap-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FFD54F] border border-[#FFE8A1] flex items-center justify-center shadow-warm-sm">
            <Sparkles className="w-4 h-4 text-stone-900" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-[#1C1917]">
                Divas Sullana
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-600 bg-[#FFF7E1] px-1.5 py-0.5 rounded border border-[#FFE8A1]/70">
                POS · Boutique
              </span>
            </div>
            <p className="text-[10px] text-[#78716C] -mt-0.5 font-medium">
              Sullana · Piura, Perú
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#FAF9F5] p-1 rounded-xl border border-stone-200/80">
          {navItems.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-stone-950 shadow-warm-sm border border-stone-200/80'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-white/50'
                }`}
              >
                <span className={isActive ? 'text-stone-950' : 'text-stone-600'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full border font-bold ${
                      item.badgeColor || 'bg-stone-100 text-stone-600 border-stone-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Right: Quick Stats, Sandbox Badge & Reset */}
      <div className="flex items-center gap-3">
        {/* Held Sales Trigger (if any) */}
        {heldSales.length > 0 && (
          <button
            onClick={() => setIsHeldSalesModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FFB366]/20 text-amber-900 border border-[#FFB366]/40 hover:bg-[#FFB366]/30 transition-colors animate-pulse"
            title="Ver ventas puestas en espera"
          >
            <PauseCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>{heldSales.length} en espera</span>
          </button>
        )}

        {/* Quick Stats: Caja Abierta */}
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#4D5B18] bg-[#A3B454]/15 border border-[#A3B454]/30"
          title={`Fondo inicial S/ ${caja.initialCash.toFixed(2)} + Ventas efectivo S/ ${caja.ventasEfectivo.toFixed(2)}`}
        >
          <Coins className="w-3.5 h-3.5 text-[#4D5B18]" />
          <span>
            Caja Abierta: <strong className="font-bold">S/ {caja.totalEnCajaFisica.toFixed(2)}</strong>
          </span>
        </div>

        {/* Demo Sandbox Badge */}
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FFF7E1] text-stone-700 border border-[#FFE8A1]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFD54F]" />
          Demo Sandbox
        </span>

        {/* Ghost button: Reiniciar datos */}
        <button
          onClick={resetAllData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/80 active:scale-95 transition-all"
          title="Restablece productos, inventario, ventas y caja al estado inicial"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>↻ Reiniciar datos</span>
        </button>

        {/* Keyboard shortcut hint */}
        <div
          className="text-stone-400 hover:text-stone-600 cursor-pointer p-1"
          title="Atajos de teclado: [F2] Buscar/Escanear · [F4] Pagar · [Esc] Cerrar modal"
        >
          <HelpCircle className="w-4 h-4" />
        </div>
      </div>
    </header>
  )
}
