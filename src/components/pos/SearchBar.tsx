import React, { useState, useRef, useEffect } from 'react'
import { ScanBarcode, X, Zap } from 'lucide-react'
import { usePosStore } from '../../store/posStore'

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery, products, addToCart, setToast } = usePosStore()
  const [isScanning, setIsScanning] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Listen for F2 key to focus search/scanner input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle enter key to test immediate barcode scan
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const query = searchQuery.trim()
      if (!query) return

      // Look for exact barcode or SKU match
      const matchedProduct = products.find(
        (p) =>
          p.barcode.toLowerCase() === query.toLowerCase() ||
          p.sku.toLowerCase() === query.toLowerCase()
      )

      if (matchedProduct) {
        // Pick first available size
        const availableSize = matchedProduct.sizes.find((s) => s.stock > 0) || matchedProduct.sizes[0]
        const availableColor = matchedProduct.colors[0]

        const success = addToCart(matchedProduct, availableSize.size, availableColor, 1)
        if (success) {
          setSearchQuery('')
          setIsScanning(true)
          setTimeout(() => setIsScanning(false), 600)
        }
      } else {
        setToast(`No se encontró prenda con código o SKU: "${query}"`, 'warning')
      }
    }
  }

  // Quick simulation helper for user testing
  const handleSimulateScan = () => {
    // Pick random product from catalog
    const randomIndex = Math.floor(Math.random() * products.length)
    const product = products[randomIndex]
    const availableSize = product.sizes.find((s) => s.stock > 0) || product.sizes[0]
    const color = product.colors[0]

    setIsScanning(true)
    setTimeout(() => {
      addToCart(product, availableSize.size, color, 1)
      setIsScanning(false)
    }, 250)
  }

  return (
    <div className="flex items-center gap-3 w-full">
      <div className={`relative flex-1 flex items-center bg-white rounded-xl border transition-all shadow-warm-sm ${
        isScanning ? 'border-[#FFD54F] ring-2 ring-[#FFD54F]/40' : 'border-stone-200 focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-200'
      }`}>
        <div className="pl-3.5 pr-2 text-stone-400 flex items-center pointer-events-none">
          <ScanBarcode className={`w-5 h-5 transition-colors ${isScanning ? 'text-amber-500 animate-pulse' : 'text-stone-400'}`} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escanear código de barras o buscar prenda... (F2)"
          className="w-full py-2.5 pr-8 text-xs md:text-sm text-stone-900 placeholder-stone-400 bg-transparent focus:outline-none"
        />
        {searchQuery ? (
          <button
            onClick={() => setSearchQuery('')}
            className="p-1 mr-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="mr-3 hidden sm:flex items-center gap-1 text-[10px] font-mono font-medium text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
            <span>Enter para escanear</span>
          </div>
        )}
      </div>

      {/* Quick barcode simulation button for instant testing */}
      <button
        onClick={handleSimulateScan}
        className="shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#FFF7E1] hover:bg-[#FFE8A1] border border-[#FFE8A1] text-xs font-semibold text-stone-800 transition-all active:scale-95 shadow-warm-sm"
        title="Simular escaneo físico con pistola láser"
      >
        <Zap className="w-3.5 h-3.5 text-amber-600" />
        <span className="hidden md:inline">Simular Pistola Láser</span>
        <span className="md:hidden">Escanear</span>
      </button>
    </div>
  )
}
