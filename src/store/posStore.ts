import { create } from 'zustand'
import {
  Product,
  ProductCategory,
  CartItem,
  Customer,
  PaymentMethod,
  SaleRecord,
  HeldSale,
  ActiveTab,
  GarmentSize,
  ColorSwatch
} from '../types'
import { INITIAL_PRODUCTS } from '../data/initialProducts'
import { DEFAULT_CUSTOMER, INITIAL_PRELOADED_SALES } from '../data/mockCustomers'

interface PosState {
  // Navigation & Catalog
  activeTab: ActiveTab
  activeCategory: ProductCategory
  searchQuery: string
  products: Product[]

  // Cart & Transaction
  cart: CartItem[]
  customer: Customer
  discount: number
  discountCode: string
  paymentMethod: PaymentMethod
  montoRecibido: number
  heldSales: HeldSale[]

  // Sales & Cash Register
  salesHistory: SaleRecord[]
  initialCash: number
  nextCorrelativo: number

  // UI Modals & Feedback
  activeBoleta: SaleRecord | null
  isCheckingOut: boolean
  isHeldSalesModalOpen: boolean
  adjustStockProduct: Product | null
  toast: { message: string; type: 'success' | 'warning' | 'info' } | null

  // Computed helper getters
  getTotals: () => {
    subtotalBruto: number
    descuento: number
    total: number
    subtotalGravado: number
    igv: number
    vuelto: number
    itemCount: number
  }
  getCajaSummary: () => {
    initialCash: number
    totalVentasHoy: number
    ventasEfectivo: number
    ventasYapePlin: number
    ventasTarjeta: number
    totalTransacciones: number
    totalEnCajaFisica: number
  }

  // Actions
  setActiveTab: (tab: ActiveTab) => void
  setActiveCategory: (cat: ProductCategory) => void
  setSearchQuery: (query: string) => void
  setCustomer: (customer: Customer) => void
  setDiscount: (discount: number, code?: string) => void
  setPaymentMethod: (method: PaymentMethod) => void
  setMontoRecibido: (amount: number) => void
  addToCart: (product: Product, size: GarmentSize, color: ColorSwatch, qty?: number) => boolean
  updateCartItemQty: (cartItemId: string, delta: number) => void
  removeFromCart: (cartItemId: string) => void
  clearCart: () => void
  holdCurrentSale: (note?: string) => boolean
  resumeHeldSale: (heldId: string) => void
  discardHeldSale: (heldId: string) => void
  setIsHeldSalesModalOpen: (open: boolean) => void
  completeCheckout: () => Promise<SaleRecord | null>
  openBoleta: (sale: SaleRecord) => void
  closeBoleta: () => void
  openAdjustStock: (product: Product) => void
  closeAdjustStock: () => void
  adjustProductStock: (productId: string, size: GarmentSize, newStock: number, reason: string) => void
  resetAllData: () => void
  setToast: (message: string, type?: 'success' | 'warning' | 'info') => void
  clearToast: () => void
}

export const usePosStore = create<PosState>((set, get) => ({
  activeTab: 'pos',
  activeCategory: 'Todos',
  searchQuery: '',
  products: JSON.parse(JSON.stringify(INITIAL_PRODUCTS)),

  cart: [],
  customer: { ...DEFAULT_CUSTOMER },
  discount: 0,
  discountCode: '',
  paymentMethod: 'EFECTIVO',
  montoRecibido: 0,
  heldSales: [],

  salesHistory: [...INITIAL_PRELOADED_SALES],
  initialCash: 450.00,
  nextCorrelativo: 482,

  activeBoleta: null,
  isCheckingOut: false,
  isHeldSalesModalOpen: false,
  adjustStockProduct: null,
  toast: null,

  getTotals: () => {
    const { cart, discount, paymentMethod, montoRecibido } = get()
    const subtotalBruto = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)
    const effectiveDiscount = Math.min(discount, subtotalBruto)
    const total = Math.max(0, subtotalBruto - effectiveDiscount)
    
    // In Peru retail: Prices include IGV.
    // Base imponible (Operaciones Gravadas) = Total / 1.18
    // IGV (18%) = Total - Base Imponible
    const subtotalGravado = Number((total / 1.18).toFixed(2))
    const igv = Number((total - subtotalGravado).toFixed(2))
    const vuelto = paymentMethod === 'EFECTIVO' ? Math.max(0, montoRecibido - total) : 0
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0)

    return {
      subtotalBruto: Number(subtotalBruto.toFixed(2)),
      descuento: Number(effectiveDiscount.toFixed(2)),
      total: Number(total.toFixed(2)),
      subtotalGravado,
      igv,
      vuelto: Number(vuelto.toFixed(2)),
      itemCount
    }
  },

  getCajaSummary: () => {
    const { initialCash, salesHistory } = get()
    let ventasEfectivo = 0
    let ventasYapePlin = 0
    let ventasTarjeta = 0

    salesHistory.forEach((sale) => {
      if (sale.paymentMethod === 'EFECTIVO') ventasEfectivo += sale.total
      else if (sale.paymentMethod === 'YAPE_PLIN') ventasYapePlin += sale.total
      else if (sale.paymentMethod === 'TARJETA') ventasTarjeta += sale.total
    })

    const totalVentasHoy = ventasEfectivo + ventasYapePlin + ventasTarjeta
    const totalEnCajaFisica = initialCash + ventasEfectivo

    return {
      initialCash,
      totalVentasHoy: Number(totalVentasHoy.toFixed(2)),
      ventasEfectivo: Number(ventasEfectivo.toFixed(2)),
      ventasYapePlin: Number(ventasYapePlin.toFixed(2)),
      ventasTarjeta: Number(ventasTarjeta.toFixed(2)),
      totalTransacciones: salesHistory.length,
      totalEnCajaFisica: Number(totalEnCajaFisica.toFixed(2))
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveCategory: (cat) => set({ activeCategory: cat }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCustomer: (customer) => set({ customer }),
  setDiscount: (discount, code = '') => set({ discount, discountCode: code }),
  setPaymentMethod: (method) => {
    const totals = get().getTotals()
    set({
      paymentMethod: method,
      // If switching to cash, default montoRecibido to total
      montoRecibido: method === 'EFECTIVO' ? totals.total : 0
    })
  },
  setMontoRecibido: (amount) => set({ montoRecibido: amount }),

  addToCart: (product, size, color, qty = 1) => {
    const { products, cart } = get()
    const targetProduct = products.find((p) => p.id === product.id)
    if (!targetProduct) return false

    const sizeObj = targetProduct.sizes.find((s) => s.size === size)
    const availableStock = sizeObj ? sizeObj.stock : 0

    if (availableStock <= 0) {
      get().setToast(`Talla ${size} de "${product.name}" agotada`, 'warning')
      return false
    }

    const cartItemId = `${product.id}-${size}-${color.name}`
    const existingIndex = cart.findIndex((item) => item.cartItemId === cartItemId)

    if (existingIndex >= 0) {
      const existing = cart[existingIndex]
      if (existing.quantity + qty > availableStock) {
        get().setToast(`Stock máximo alcanzado para talla ${size} (${availableStock} disp.)`, 'warning')
        return false
      }
      const updatedCart = [...cart]
      updatedCart[existingIndex] = {
        ...existing,
        quantity: existing.quantity + qty,
        maxStock: availableStock
      }
      set({ cart: updatedCart })
    } else {
      const newItem: CartItem = {
        cartItemId,
        productId: product.id,
        name: product.name,
        category: product.category,
        sku: product.sku,
        barcode: product.barcode,
        size,
        color,
        unitPrice: product.price,
        quantity: qty,
        maxStock: availableStock
      }
      set({ cart: [...cart, newItem] })
    }

    // Auto-update cash tender if in cash mode
    setTimeout(() => {
      if (get().paymentMethod === 'EFECTIVO') {
        const { total } = get().getTotals()
        set({ montoRecibido: total })
      }
    }, 0)

    get().setToast(`Añadido: ${product.name} (${size})`, 'success')
    return true
  },

  updateCartItemQty: (cartItemId, delta) => {
    const { cart } = get()
    const item = cart.find((i) => i.cartItemId === cartItemId)
    if (!item) return

    const newQty = item.quantity + delta
    if (newQty <= 0) {
      get().removeFromCart(cartItemId)
      return
    }

    if (newQty > item.maxStock) {
      get().setToast(`Stock máximo disponible alcanzado (${item.maxStock})`, 'warning')
      return
    }

    set({
      cart: cart.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity: newQty } : i))
    })

    if (get().paymentMethod === 'EFECTIVO') {
      const { total } = get().getTotals()
      set({ montoRecibido: total })
    }
  },

  removeFromCart: (cartItemId) => {
    set({ cart: get().cart.filter((i) => i.cartItemId !== cartItemId) })
    if (get().paymentMethod === 'EFECTIVO') {
      const { total } = get().getTotals()
      set({ montoRecibido: total })
    }
  },

  clearCart: () => {
    set({
      cart: [],
      discount: 0,
      discountCode: '',
      montoRecibido: 0,
      customer: { ...DEFAULT_CUSTOMER }
    })
    get().setToast('Carrito vaciado', 'info')
  },

  holdCurrentSale: (note = '') => {
    const { cart, customer, discount, heldSales } = get()
    if (cart.length === 0) {
      get().setToast('El carrito está vacío, nada que retener', 'warning')
      return false
    }

    const newHold: HeldSale = {
      id: `hold-${Date.now()}`,
      timestamp: new Date().toISOString(),
      customer: { ...customer },
      items: [...cart],
      discount,
      note: note || `Venta con ${cart.length} prenda(s)`
    }

    set({
      heldSales: [newHold, ...heldSales],
      cart: [],
      customer: { ...DEFAULT_CUSTOMER },
      discount: 0,
      discountCode: '',
      montoRecibido: 0
    })

    get().setToast('Venta puesta en espera exitosamente', 'info')
    return true
  },

  resumeHeldSale: (heldId) => {
    const { heldSales } = get()
    const hold = heldSales.find((h) => h.id === heldId)
    if (!hold) return

    set({
      cart: [...hold.items],
      customer: { ...hold.customer },
      discount: hold.discount,
      heldSales: heldSales.filter((h) => h.id !== heldId),
      isHeldSalesModalOpen: false
    })

    if (get().paymentMethod === 'EFECTIVO') {
      const { total } = get().getTotals()
      set({ montoRecibido: total })
    }

    get().setToast('Venta en espera reanudada', 'success')
  },

  discardHeldSale: (heldId) => {
    set({
      heldSales: get().heldSales.filter((h) => h.id !== heldId)
    })
    get().setToast('Venta en espera descartada', 'info')
  },

  setIsHeldSalesModalOpen: (open) => set({ isHeldSalesModalOpen: open }),

  completeCheckout: async () => {
    const { cart, customer, paymentMethod, montoRecibido, nextCorrelativo, products, salesHistory } = get()
    if (cart.length === 0) {
      get().setToast('El carrito está vacío', 'warning')
      return null
    }

    const totals = get().getTotals()

    if (paymentMethod === 'EFECTIVO' && montoRecibido < totals.total) {
      get().setToast(`Monto recibido (S/ ${montoRecibido.toFixed(2)}) es menor al total (S/ ${totals.total.toFixed(2)})`, 'warning')
      return null
    }

    set({ isCheckingOut: true })

    // Simulate 200ms processing state as requested
    await new Promise((resolve) => setTimeout(resolve, 200))

    // 1. Atomic Stock Deduction
    const updatedProducts = products.map((prod) => {
      const cartItemsForProd = cart.filter((item) => item.productId === prod.id)
      if (cartItemsForProd.length === 0) return prod

      const updatedSizes = prod.sizes.map((s) => {
        const itemForSize = cartItemsForProd.find((ci) => ci.size === s.size)
        if (!itemForSize) return s
        const newStock = Math.max(0, s.stock - itemForSize.quantity)
        return { ...s, stock: newStock }
      })

      return {
        ...prod,
        sizes: updatedSizes
      }
    })

    // 2. Generate Boleta Electrónica Record
    const correlativoStr = String(nextCorrelativo).padStart(6, '0')
    const numeroCompleto = `B001-${correlativoStr}`
    const randomHash = Math.random().toString(36).substring(2, 12) + '=' + Math.random().toString(36).substring(2, 6)

    const saleRecord: SaleRecord = {
      id: `sale-${Date.now()}`,
      serie: 'B001',
      correlativo: correlativoStr,
      numeroCompleto,
      timestamp: new Date().toISOString(),
      customer: { ...customer },
      items: [...cart],
      subtotalGravado: totals.subtotalGravado,
      igv: totals.igv,
      descuento: totals.descuento,
      total: totals.total,
      paymentMethod,
      montoRecibido: paymentMethod === 'EFECTIVO' ? montoRecibido : totals.total,
      vuelto: totals.vuelto,
      hashSunat: randomHash,
      cajero: 'Gianmarco M.'
    }

    set({
      products: updatedProducts,
      salesHistory: [saleRecord, ...salesHistory],
      nextCorrelativo: nextCorrelativo + 1,
      cart: [],
      customer: { ...DEFAULT_CUSTOMER },
      discount: 0,
      discountCode: '',
      montoRecibido: 0,
      isCheckingOut: false,
      activeBoleta: saleRecord
    })

    get().setToast(`¡Venta completada! Boleta ${numeroCompleto} generada`, 'success')
    return saleRecord
  },

  openBoleta: (sale) => set({ activeBoleta: sale }),
  closeBoleta: () => set({ activeBoleta: null }),

  openAdjustStock: (product) => set({ adjustStockProduct: product }),
  closeAdjustStock: () => set({ adjustStockProduct: null }),

  adjustProductStock: (productId, size, newStock, reason) => {
    const { products } = get()
    const updated = products.map((prod) => {
      if (prod.id !== productId) return prod
      return {
        ...prod,
        sizes: prod.sizes.map((s) => (s.size === size ? { ...s, stock: Math.max(0, newStock) } : s))
      }
    })

    set({
      products: updated,
      adjustStockProduct: null
    })

    get().setToast(`Stock de ${size} actualizado a ${newStock} (${reason})`, 'success')
  },

  resetAllData: () => {
    set({
      products: JSON.parse(JSON.stringify(INITIAL_PRODUCTS)),
      cart: [],
      customer: { ...DEFAULT_CUSTOMER },
      discount: 0,
      discountCode: '',
      paymentMethod: 'EFECTIVO',
      montoRecibido: 0,
      heldSales: [],
      salesHistory: [...INITIAL_PRELOADED_SALES],
      initialCash: 450.00,
      nextCorrelativo: 482,
      activeBoleta: null,
      isCheckingOut: false,
      isHeldSalesModalOpen: false,
      adjustStockProduct: null
    })
    get().setToast('Datos restaurados al estado inicial demo', 'info')
  },

  setToast: (message, type = 'info') => {
    set({ toast: { message, type } })
    setTimeout(() => {
      const current = get().toast
      if (current && current.message === message) {
        set({ toast: null })
      }
    }, 3200)
  },

  clearToast: () => set({ toast: null })
}))
