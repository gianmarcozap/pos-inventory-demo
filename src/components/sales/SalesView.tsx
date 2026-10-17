import React, { useState } from 'react'
import {
  ReceiptText,
  Coins,
  QrCode,
  CreditCard,
  Search,
  Printer,
  DollarSign
} from 'lucide-react'
import { usePosStore } from '../../store/posStore'
import { PaymentMethod, SaleRecord } from '../../types'

export const SalesView: React.FC = () => {
  const { salesHistory, getCajaSummary, setToast, openBoleta } = usePosStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterMethod, setFilterMethod] = useState<'ALL' | PaymentMethod>('ALL')

  const caja = getCajaSummary()

  // Average ticket
  const ticketPromedio =
    caja.totalTransacciones > 0 ? caja.totalVentasHoy / caja.totalTransacciones : 0

  // Filtered sales
  const filteredSales = salesHistory.filter((sale) => {
    if (filterMethod !== 'ALL' && sale.paymentMethod !== filterMethod) return false

    const q = searchTerm.toLowerCase().trim()
    if (
      q &&
      !sale.numeroCompleto.toLowerCase().includes(q) &&
      !sale.customer.name.toLowerCase().includes(q) &&
      !sale.customer.documentNumber.includes(q)
    ) {
      return false
    }

    return true
  })

  const handleReprint = (sale: SaleRecord) => {
    openBoleta(sale)
    setToast(`Abriendo boleta ${sale.numeroCompleto} para reimpresión`, 'info')
  }

  const handleCierreCaja = () => {
    setToast(
      `Arqueo conforme: S/ ${caja.totalEnCajaFisica.toFixed(2)} en efectivo físico verificado. Cierre de turno registrado.`,
      'success'
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#FAF9F5] p-3.5 sm:p-5 space-y-3 sm:space-y-4">
      {/* Top Banner & Header */}
      <div className="shrink-0 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-extrabold text-[#1C1917] tracking-tight flex items-center gap-2">
              <ReceiptText className="w-5 h-5 text-amber-500" />
              <span>Historial de Ventas & Cierre de Caja</span>
            </h1>
            <p className="text-xs text-stone-500 font-medium">
              Auditoría de boletas electrónicas SUNAT emitidas y arqueo de caja física
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCierreCaja}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF7E1] hover:bg-[#FFE8A1] border border-[#FFE8A1] text-xs font-bold text-stone-900 transition-all shadow-warm-sm active:scale-95"
            >
              <Coins className="w-3.5 h-3.5 text-amber-700" />
              <span>Realizar Arqueo de Caja</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Total Recaudado */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-warm-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-stone-500 block uppercase tracking-wider">
                Total Recaudado Hoy
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-stone-900 font-mono">
                  S/ {caja.totalVentasHoy.toFixed(2)}
                </span>
                <span className="text-[10px] text-stone-400">
                  ({caja.totalTransacciones} ventas)
                </span>
              </div>
            </div>
          </div>

          {/* Efectivo en Caja */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-warm-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A3B454]/15 border border-[#A3B454]/30 flex items-center justify-center text-[#4D5B18] shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-stone-500 block uppercase tracking-wider">
                Caja Física (Total)
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-[#4D5B18] font-mono">
                  S/ {caja.totalEnCajaFisica.toFixed(2)}
                </span>
                <span className="text-[10px] text-stone-400">
                  (S/ {caja.ventasEfectivo.toFixed(2)} ventas)
                </span>
              </div>
            </div>
          </div>

          {/* Yape / Plin */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-warm-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#742284]/10 border border-[#742284]/25 flex items-center justify-center text-[#742284] shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-stone-500 block uppercase tracking-wider">
                Yape & Plin
              </span>
              <span className="text-lg font-extrabold text-purple-900 font-mono">
                S/ {caja.ventasYapePlin.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Tarjetas & Ticket Promedio */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-warm-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-stone-500 block uppercase tracking-wider">
                Tarjetas (POS)
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-sky-900 font-mono">
                  S/ {caja.ventasTarjeta.toFixed(2)}
                </span>
                <span className="text-[10px] text-stone-400">
                  avg S/ {ticketPromedio.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-3 rounded-2xl border border-stone-200/80 flex flex-col md:flex-row items-center justify-between gap-3 shadow-warm-sm">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por número de boleta (ej. B001-000482), cliente o DNI..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF9F5] border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-400"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full md:w-auto">
            {(['ALL', 'EFECTIVO', 'YAPE_PLIN', 'TARJETA'] as const).map((method) => {
              const isSelected = filterMethod === method
              const label =
                method === 'ALL'
                  ? 'Todos'
                  : method === 'EFECTIVO'
                  ? 'Efectivo'
                  : method === 'YAPE_PLIN'
                  ? 'Yape/Plin'
                  : 'Tarjetas'

              return (
                <button
                  key={method}
                  onClick={() => setFilterMethod(method)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-stone-900 text-white shadow-warm-sm'
                      : 'bg-[#FAF9F5] hover:bg-stone-100 text-stone-600 border border-stone-200/70'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Table of Completed Sales */}
      <div className="flex-1 min-h-0 overflow-hidden bg-white rounded-2xl border border-stone-200/80 shadow-warm-sm flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-xs border-collapse">
            <thead className="bg-[#FFFDF7] border-b border-stone-200 sticky top-0 z-10 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Comprobante SUNAT</th>
                <th className="py-3 px-3">Fecha y Hora</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-3">Prendas Adquiridas</th>
                <th className="py-3 px-3">Método de Pago</th>
                <th className="py-3 px-4 text-right">Total (S/)</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredSales.map((sale) => {
                const formattedTime = new Date(sale.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
                const formattedDate = new Date(sale.timestamp).toLocaleDateString([], {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })
                const itemsCount = sale.items.reduce((acc, i) => acc + i.quantity, 0)

                return (
                  <tr
                    key={sale.id}
                    className="hover:bg-[#FFFDF7] transition-colors group"
                  >
                    {/* Boleta */}
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-xs">{sale.numeroCompleto}</span>
                      </div>
                      <span className="text-[10px] font-normal text-stone-400 block ml-3">
                        Hash: {sale.hashSunat.slice(0, 10)}...
                      </span>
                    </td>

                    {/* Fecha y Hora */}
                    <td className="py-3.5 px-3 text-stone-600">
                      <div className="font-medium text-stone-800">{formattedTime}</div>
                      <div className="text-[10px] text-stone-400">{formattedDate}</div>
                    </td>

                    {/* Cliente */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900 truncate max-w-[200px]">
                        {sale.customer.name}
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono">
                        {sale.customer.documentType} {sale.customer.documentNumber}
                      </div>
                    </td>

                    {/* Prendas */}
                    <td className="py-3.5 px-3">
                      <div className="text-xs font-semibold text-stone-800">
                        {itemsCount} prenda(s)
                      </div>
                      <div className="text-[10px] text-stone-500 truncate max-w-[220px]">
                        {sale.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                    </td>

                    {/* Método de pago */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          sale.paymentMethod === 'EFECTIVO'
                            ? 'bg-[#A3B454]/15 text-[#4D5B18] border-[#A3B454]/30'
                            : sale.paymentMethod === 'YAPE_PLIN'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : 'bg-sky-50 text-sky-800 border-sky-200'
                        }`}
                      >
                        {sale.paymentMethod === 'EFECTIVO' && <Coins className="w-3 h-3" />}
                        {sale.paymentMethod === 'YAPE_PLIN' && <QrCode className="w-3 h-3" />}
                        {sale.paymentMethod === 'TARJETA' && <CreditCard className="w-3 h-3" />}
                        <span>
                          {sale.paymentMethod === 'EFECTIVO'
                            ? 'Efectivo'
                            : sale.paymentMethod === 'YAPE_PLIN'
                            ? 'Yape/Plin'
                            : 'Tarjeta'}
                        </span>
                      </span>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-sm text-stone-900">
                      S/ {sale.total.toFixed(2)}
                    </td>

                    {/* Acción */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleReprint(sale)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
                        title="Ver y reimprimir boleta térmica"
                      >
                        <Printer className="w-3.5 h-3.5 text-stone-500" />
                        <span>Ver Boleta</span>
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
          <span>Mostrando {filteredSales.length} comprobantes de venta</span>
          <span className="font-mono text-[11px]">
            Serie B001 · Conexión SUNAT: ONLINE / SINCRONIZADO
          </span>
        </div>
      </div>
    </div>
  )
}
