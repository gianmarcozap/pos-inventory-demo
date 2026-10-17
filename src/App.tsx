import { useEffect } from 'react'
import { Header } from './components/Header'
import { CatalogSection } from './components/pos/CatalogSection'
import { CartSection } from './components/pos/CartSection'
import { InventoryView } from './components/inventory/InventoryView'
import { SalesView } from './components/sales/SalesView'
import { BoletaModal } from './components/modals/BoletaModal'
import { HeldSalesModal } from './components/pos/HeldSalesModal'
import { StockAdjustModal } from './components/modals/StockAdjustModal'
import { usePosStore } from './store/posStore'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'

export default function App() {
  const {
    activeTab,
    toast,
    clearToast,
    cart,
    completeCheckout,
    activeBoleta,
    closeBoleta,
    isHeldSalesModalOpen,
    setIsHeldSalesModalOpen,
    adjustStockProduct,
    closeAdjustStock
  } = usePosStore()

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes modals
      if (e.key === 'Escape') {
        if (activeBoleta) closeBoleta()
        if (isHeldSalesModalOpen) setIsHeldSalesModalOpen(false)
        if (adjustStockProduct) closeAdjustStock()
      }

      // F4 triggers checkout if cart has items and no modal is open
      if (e.key === 'F4') {
        e.preventDefault()
        if (cart.length > 0 && !activeBoleta && !isHeldSalesModalOpen && !adjustStockProduct) {
          completeCheckout()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    activeBoleta,
    isHeldSalesModalOpen,
    adjustStockProduct,
    cart,
    closeBoleta,
    setIsHeldSalesModalOpen,
    closeAdjustStock,
    completeCheckout
  ])

  return (
    <div className="h-screen w-screen flex flex-col bg-[#FAF9F5] text-[#1C1917] overflow-hidden select-none">
      {/* Fixed Height 3.5rem (h-14) Top Header */}
      <Header />

      {/* Main Screen Content: Exactly h-[calc(100vh-3.5rem)] */}
      <main className="h-[calc(100vh-3.5rem)] w-full overflow-hidden flex flex-col">
        {activeTab === 'pos' && (
          <div className="h-full w-full flex flex-col lg:flex-row overflow-hidden">
            <CatalogSection />
            <CartSection />
          </div>
        )}

        {activeTab === 'inventario' && <InventoryView />}

        {activeTab === 'ventas' && <SalesView />}
      </main>

      {/* Modals */}
      <BoletaModal />
      <HeldSalesModal />
      <StockAdjustModal />

      {/* Global Interactive Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-warm-lg bg-white border border-stone-200/90 text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200 max-w-sm">
          {toast.type === 'success' && (
            <CheckCircle2 className="w-4 h-4 text-[#A3B454] shrink-0" />
          )}
          {toast.type === 'warning' && (
            <AlertTriangle className="w-4 h-4 text-[#FFB366] shrink-0" />
          )}
          {toast.type === 'info' && (
            <Info className="w-4 h-4 text-stone-500 shrink-0" />
          )}
          <span className="text-stone-800 flex-1">{toast.message}</span>
          <button
            onClick={clearToast}
            className="p-0.5 text-stone-400 hover:text-stone-700 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
