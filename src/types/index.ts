export type GarmentSize = 'S' | 'M' | 'L' | 'XL'

export type ProductCategory = 'Todos' | 'Vestidos' | 'Blusas & Tops' | 'Jeans & Pantalones' | 'Conjuntos'

export interface ColorSwatch {
  name: string
  hex: string
}

export interface SizeStock {
  size: GarmentSize
  stock: number
}

export interface Product {
  id: string
  name: string
  category: Exclude<ProductCategory, 'Todos'>
  sku: string
  barcode: string
  price: number
  colors: ColorSwatch[]
  sizes: SizeStock[]
  minStockThreshold: number
  imageTag: 'vestido-midi' | 'vestido-fiesta' | 'vestido-camisero' | 'blusa-lino' | 'blusa-abullonada' | 'top-ribbed' | 'pantalon-wide' | 'jeans-mom' | 'pantalon-culotte' | 'conjunto-boho' | 'conjunto-blazer' | 'conjunto-tropical'
  description: string
}

export interface CartItem {
  cartItemId: string
  productId: string
  name: string
  category: string
  sku: string
  barcode: string
  size: GarmentSize
  color: ColorSwatch
  unitPrice: number
  quantity: number
  maxStock: number
}

export interface Customer {
  documentType: 'DNI' | 'RUC'
  documentNumber: string
  name: string
  email?: string
  phone?: string
  address?: string
}

export type PaymentMethod = 'EFECTIVO' | 'YAPE_PLIN' | 'TARJETA'

export interface SaleRecord {
  id: string
  serie: string
  correlativo: string
  numeroCompleto: string
  timestamp: string
  customer: Customer
  items: CartItem[]
  subtotalGravado: number
  igv: number
  descuento: number
  total: number
  paymentMethod: PaymentMethod
  montoRecibido?: number
  vuelto?: number
  hashSunat: string
  cajero: string
}

export interface HeldSale {
  id: string
  timestamp: string
  customer: Customer
  items: CartItem[]
  discount: number
  note?: string
}

export type ActiveTab = 'pos' | 'inventario' | 'ventas'
