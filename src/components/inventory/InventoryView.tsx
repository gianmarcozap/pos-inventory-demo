import React, { useState } from 'react'
import {
  Search,
  Filter,
  AlertTriangle,
  Package,
  Layers,
  Edit3,
  TrendingUp,
  XCircle
} from 'lucide-react'
import { usePosStore } from '../../store/posStore'
import { ProductCategory } from '../../types'
import { ApparelIcon } from '../icons/ApparelIcon'

export const InventoryView: React.FC = () => {
  const { products, openAdjustStock } = usePosStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCat, setSelectedCat] = useState<ProductCategory>('Todos')
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'critical' | 'healthy'>('all')

  // Overall Inventory Analytics
  const totalModels = products.length
  const totalPhysicalUnits = products.reduce(
    (acc, p) => acc + p.sizes.reduce((sum, s) => sum + s.stock, 0),
    0
  )
  const totalInventoryValue = products.reduce(
    (acc, p) => acc + p.sizes.reduce((sum, s) => sum + s.stock * p.price, 0),
    0
  )
  const criticalVariantsCount = products.reduce(
    (acc, p) => acc + p.sizes.filter((s) => s.stock > 0 && s.stock <= p.minStockThreshold).length,
    0
  )
  const outOfStockCount = products.reduce(
    (acc, p) => acc + p.sizes.filter((s) => s.stock === 0).length,
    0
  )

  // Filter products
  const filtered = products.filter((prod) => {
    // Category
    if (selectedCat !== 'Todos' && prod.category !== selectedCat) return false

    // Search query
    const q = searchTerm.toLowerCase().trim()
    if (
      q &&
      !prod.name.toLowerCase().includes(q) &&
      !prod.sku.toLowerCase().includes(q) &&
      !prod.barcode.toLowerCase().includes(q)
    ) {
      return false
    }

    // Stock status
    if (stockStatusFilter === 'critical') {
      const hasCriticalOrZero = prod.sizes.some((s) => s.stock <= prod.minStockThreshold)
      if (!hasCriticalOrZero) return false
    } else if (stockStatusFilter === 'healthy') {
      const allHealthy = prod.sizes.every((s) => s.stock > prod.minStockThreshold)
      if (!allHealthy) return false
    }

    return true
  })

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#FAF9F5] p-6 space-y-5">
      {/* Top Banner & KPI Metrics */}
      <div className="shrink-0 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-extrabold text-[#1C1917] tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500" />
              <span>Inventario & Existencias de Tienda</span>
            </h1>
            <p className="text-xs text-stone-500 font-medium">
              Supervisión de stock por SKU, tallas y reposición física · Divas Sullana
            </p>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Total Units */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-warm-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF7E1] border border-[#FFE8A1] flex items-center justify-center text-amber-800 shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-stone-500 block uppercase tracking-wider">
                Unidades Totales
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-stone-900 font-mono">
                  {totalPhysicalUnits}
                </span>
                <span className="text-[10px] text-stone-400">en {totalModels} prendas</span>
              </div>
            </div>
          </div>

          {/* Valorización */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-warm-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A3B454]/15 border border-[#A3B454]/30 flex items-center justify-center text-[#4D5B18] shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-stone-500 block uppercase tracking-wider">
                Valor del Stock
              </span>
              <span className="text-lg font-extrabold text-[#4D5B18] font-mono">
                S/ {totalInventoryValue.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Variantes Críticas */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-warm-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFB366]/20 border border-[#FFB366]/40 flex items-center justify-center text-amber-800 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-stone-500 block uppercase tracking-wider">
                Tallas en Stock Crítico
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-amber-800 font-mono">
                  {criticalVariantsCount}
                </span>
                <span className="text-[10px] text-stone-400">≤ 3 unidades</span>
              </div>
            </div>
          </div>

          {/* Agotadas */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-warm-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600 shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-stone-500 block uppercase tracking-wider">
                Tallas Agotadas
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-stone-700 font-mono">
                  {outOfStockCount}
                </span>
                <span className="text-[10px] text-stone-400">requieren reposición</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-3 rounded-2xl border border-stone-200/80 flex flex-col md:flex-row items-center justify-between gap-3 shadow-warm-sm">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por SKU, nombre de prenda o código de barras..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF9F5] border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-400"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1 text-xs text-stone-500 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>Categoría:</span>
            </div>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value as ProductCategory)}
              className="py-1.5 px-2.5 text-xs font-semibold bg-[#FAF9F5] border border-stone-200 rounded-xl text-stone-800 focus:outline-none"
            >
              <option value="Todos">Todas las categorías</option>
              <option value="Vestidos">Vestidos</option>
              <option value="Blusas & Tops">Blusas & Tops</option>
              <option value="Jeans & Pantalones">Jeans & Pantalones</option>
              <option value="Conjuntos">Conjuntos</option>
            </select>

            {/* Stock status filter */}
            <select
              value={stockStatusFilter}
              onChange={(e) => setStockStatusFilter(e.target.value as any)}
              className="py-1.5 px-2.5 text-xs font-semibold bg-[#FAF9F5] border border-stone-200 rounded-xl text-stone-800 focus:outline-none"
            >
              <option value="all">Todo el stock</option>
              <option value="critical">Solo Crítico / Agotado</option>
              <option value="healthy">Stock Saludable</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="flex-1 overflow-hidden bg-white rounded-2xl border border-stone-200/80 shadow-warm-sm flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FFFDF7] border-b border-stone-200 sticky top-0 z-10 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Prenda / Modelo</th>
                <th className="py-3 px-3">Categoría</th>
                <th className="py-3 px-3">Precio Unitario</th>
                <th className="py-3 px-3">Colores</th>
                <th className="py-3 px-4">Stock por Talla (S / M / L / XL)</th>
                <th className="py-3 px-3 text-center">Total Stock</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((product) => {
                const totalStock = product.sizes.reduce((acc, s) => acc + s.stock, 0)
                const hasZero = product.sizes.some((s) => s.stock === 0)
                const hasCritical = product.sizes.some(
                  (s) => s.stock > 0 && s.stock <= product.minStockThreshold
                )

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-[#FFFDF7] transition-colors group"
                  >
                    {/* Prenda / Modelo */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] border border-stone-200/80 p-1 flex items-center justify-center shrink-0">
                          <ApparelIcon
                            tag={product.imageTag}
                            color={product.colors[0].hex}
                            className="w-7 h-7"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 leading-snug">
                            {product.name}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-stone-600 font-mono mt-0.5">
                            <span>SKU: {product.sku}</span>
                            <span>·</span>
                            <span>EAN: {product.barcode}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Categoría */}
                    <td className="py-3 px-3">
                      <span className="inline-block text-[11px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200/60">
                        {product.category}
                      </span>
                    </td>

                    {/* Precio Unitario */}
                    <td className="py-3 px-3 font-mono font-bold text-stone-900">
                      S/ {product.price.toFixed(2)}
                    </td>

                    {/* Colores */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        {product.colors.map((c) => (
                          <span
                            key={c.name}
                            className="w-3 h-3 rounded-full border border-stone-300 inline-block shadow-2xs"
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Stock por Talla */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {product.sizes.map((s) => {
                          let pillStyle =
                            'bg-[#A3B454]/15 text-[#4D5B18] border-[#A3B454]/30'
                          if (s.stock === 0) {
                            pillStyle = 'bg-stone-100 text-stone-400 border-stone-200'
                          } else if (s.stock <= product.minStockThreshold) {
                            pillStyle = 'bg-[#FFB366]/20 text-amber-900 border-[#FFB366]/40'
                          }

                          return (
                            <span
                              key={s.size}
                              className={`px-2 py-0.5 rounded-md border text-[11px] font-bold font-mono inline-flex items-center gap-1 ${pillStyle}`}
                              title={`Talla ${s.size}: ${s.stock} un.`}
                            >
                              <span className="text-stone-500 font-sans font-medium">{s.size}:</span>
                              <span>{s.stock}</span>
                            </span>
                          )
                        })}
                      </div>
                    </td>

                    {/* Total Stock */}
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-mono font-extrabold text-sm text-stone-900">
                          {totalStock}
                        </span>
                        {hasZero ? (
                          <span className="text-[9px] font-bold text-stone-400 uppercase">
                            Agotado en tallas
                          </span>
                        ) : hasCritical ? (
                          <span className="text-[9px] font-bold text-amber-800 uppercase">
                            Stock Crítico
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-[#4D5B18] uppercase">
                            Óptimo
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Acción: + Ajustar Stock */}
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => openAdjustStock(product)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FFF7E1] hover:bg-[#FFE8A1] text-stone-900 border border-[#FFE8A1] shadow-warm-sm transition-all active:scale-95"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                        <span>+ Ajustar Stock</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#FFFDF7] border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Mostrando {filtered.length} modelos de prendas en catálogo</span>
          <span className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#A3B454]" /> Óptimo (&gt;3)
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#FFB366]" /> Crítico (1-3)
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-stone-300" /> Agotado (0)
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
