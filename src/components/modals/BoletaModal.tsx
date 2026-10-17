import React from 'react'
import {
  Printer,
  Sparkles,
  CheckCircle2,
  X,
  CreditCard,
  Banknote,
  QrCode as QrIcon
} from 'lucide-react'
import { usePosStore } from '../../store/posStore'

export const BoletaModal: React.FC = () => {
  const { activeBoleta, closeBoleta, setToast, activeTab } = usePosStore()

  if (!activeBoleta) return null

  const handlePrint = () => {
    setToast('Enviando ticket a impresora térmica...', 'info')
    window.print()
  }

  const handleClose = () => {
    closeBoleta()
  }

  const formattedDate = new Date(activeBoleta.timestamp).toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  const isFromHistory = activeTab === 'ventas'

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      {/* Modal Dialog Card: Constrained to viewport height */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 shadow-warm-xl max-w-md w-full max-h-[calc(100vh-1rem)] sm:max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header: Always pinned and visible */}
        <div className="shrink-0 bg-gradient-to-r from-emerald-600 to-[#A3B454] px-4 py-2.5 sm:py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs sm:text-sm tracking-tight leading-tight">
                {isFromHistory ? 'Detalle de Comprobante' : '¡Venta Exitosa!'}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-white/90 leading-tight">
                {isFromHistory ? 'Comprobante emitido por SUNAT' : 'Comprobante emitido y stock descontado'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Cerrar modal (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Receipt Container: Only this scrolls if needed */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 bg-stone-100/70 flex justify-center">
          <div
            id="printable-ticket"
            className="bg-[#FFFDF7] text-stone-900 w-full max-w-[340px] p-4 sm:p-5 rounded-xl border border-stone-200 shadow-warm font-mono text-xs space-y-2.5 relative"
          >
            {/* Top Store Header */}
            <div className="text-center space-y-0.5 border-b border-dashed border-stone-300 pb-2.5">
              <div className="flex items-center justify-center gap-1 text-stone-900 font-sans font-extrabold text-sm sm:text-base">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>DIVAS SULLANA</span>
              </div>
              <p className="font-bold text-[10px] sm:text-[11px] tracking-wider text-stone-800">
                DIVAS SULLANA S.A.C.
              </p>
              <p className="text-[10px] sm:text-[11px] font-bold text-stone-700">RUC: 20601234567</p>
              <p className="text-[10px] text-stone-500">
                Calle San Martín 450, Sullana, Piura
              </p>
              <p className="text-[9px] text-stone-500">Tel: (073) 502211 · Cel: 969 123 456</p>
            </div>

            {/* Document Info */}
            <div className="text-center py-0.5 border-b border-dashed border-stone-300 space-y-0.5">
              <span className="font-sans font-extrabold text-[11px] block text-stone-900">
                BOLETA DE VENTA ELECTRÓNICA
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-stone-900 tracking-wider">
                {activeBoleta.numeroCompleto}
              </span>
            </div>

            {/* Customer & Timestamp */}
            <div className="text-[10px] space-y-0.5 border-b border-dashed border-stone-300 pb-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Fecha / Hora:</span>
                <span className="font-medium text-stone-800">{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Cajero(a):</span>
                <span className="font-medium text-stone-800">{activeBoleta.cajero}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">{activeBoleta.customer.documentType}:</span>
                <span className="font-medium text-stone-800">{activeBoleta.customer.documentNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Cliente:</span>
                <span className="font-medium text-stone-800 text-right truncate max-w-[180px]">
                  {activeBoleta.customer.name}
                </span>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="space-y-1.5 border-b border-dashed border-stone-300 pb-2">
              <div className="flex justify-between text-[10px] font-bold text-stone-600 border-b border-stone-200 pb-0.5">
                <span className="w-6">CANT</span>
                <span className="flex-1 px-1">DESCRIPCIÓN</span>
                <span className="w-14 text-right">TOTAL</span>
              </div>

              {activeBoleta.items.map((item, idx) => {
                const rowTotal = item.unitPrice * item.quantity
                return (
                  <div key={idx} className="space-y-0.5 text-[10px]">
                    <div className="flex justify-between">
                      <span className="w-6 font-bold">{item.quantity}</span>
                      <span className="flex-1 px-1 truncate font-medium">
                        {item.name}
                      </span>
                      <span className="w-14 text-right font-bold">
                        S/ {rowTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[9px] text-stone-500 pl-6 pr-1">
                      <span>
                        Talla {item.size} · {item.color.name}
                      </span>
                      <span>S/ {item.unitPrice.toFixed(2)} c/u</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-0.5 text-[10px] border-b border-dashed border-stone-300 pb-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Op. Gravadas:</span>
                <span>S/ {activeBoleta.subtotalGravado.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">IGV (18.00%):</span>
                <span>S/ {activeBoleta.igv.toFixed(2)}</span>
              </div>
              {activeBoleta.descuento > 0 && (
                <div className="flex justify-between text-amber-800">
                  <span>Descuento:</span>
                  <span>- S/ {activeBoleta.descuento.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-bold font-sans pt-1 border-t border-stone-200">
                <span>IMPORTE TOTAL:</span>
                <span>S/ {activeBoleta.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="text-[10px] space-y-0.5 border-b border-dashed border-stone-300 pb-1.5">
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Forma de Pago:</span>
                <span className="font-bold flex items-center gap-1">
                  {activeBoleta.paymentMethod === 'EFECTIVO' && <Banknote className="w-3 h-3" />}
                  {activeBoleta.paymentMethod === 'TARJETA' && <CreditCard className="w-3 h-3" />}
                  {activeBoleta.paymentMethod === 'YAPE_PLIN' && <QrIcon className="w-3 h-3" />}
                  {activeBoleta.paymentMethod}
                </span>
              </div>
              {activeBoleta.paymentMethod === 'EFECTIVO' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Monto Recibido:</span>
                    <span>S/ {(activeBoleta.montoRecibido || activeBoleta.total).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-stone-800">
                    <span className="text-stone-500">Vuelto:</span>
                    <span>S/ {(activeBoleta.vuelto || 0).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            {/* QR Simulation & SUNAT Certification */}
            <div className="pt-0.5 flex flex-col items-center text-center space-y-1">
              <div className="w-16 h-16 p-1 bg-white border border-stone-300 rounded flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-stone-900">
                  <rect x="10" y="10" width="25" height="25" fill="#1C1917" />
                  <rect x="15" y="15" width="15" height="15" fill="#FFFDF7" />
                  <rect x="18" y="18" width="9" height="9" fill="#1C1917" />
                  
                  <rect x="65" y="10" width="25" height="25" fill="#1C1917" />
                  <rect x="70" y="15" width="15" height="15" fill="#FFFDF7" />
                  <rect x="73" y="18" width="9" height="9" fill="#1C1917" />

                  <rect x="10" y="65" width="25" height="25" fill="#1C1917" />
                  <rect x="15" y="70" width="15" height="15" fill="#FFFDF7" />
                  <rect x="18" y="73" width="9" height="9" fill="#1C1917" />

                  <rect x="40" y="10" width="15" height="10" />
                  <rect x="40" y="25" width="20" height="8" />
                  <rect x="10" y="40" width="10" height="20" />
                  <rect x="25" y="45" width="15" height="10" />
                  <rect x="45" y="40" width="25" height="20" />
                  <rect x="75" y="45" width="15" height="15" />
                  <rect x="40" y="65" width="10" height="25" />
                  <rect x="55" y="70" width="35" height="10" />
                  <rect x="60" y="85" width="30" height="5" />
                </svg>
              </div>

              <div className="text-[8px] sm:text-[9px] text-stone-500 leading-tight">
                <p className="font-mono text-stone-400">Hash: {activeBoleta.hashSunat}</p>
                <p className="font-semibold text-stone-600 mt-0.5">
                  Representación impresa de la Boleta de Venta Electrónica
                </p>
                <p className="text-stone-400">Autorizado mediante Resolución SUNAT</p>
                <p className="font-medium text-stone-700 mt-0.5">
                  ¡Gracias por su compra en Divas Sullana!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions: Always pinned at bottom and fully visible */}
        <div className="shrink-0 p-3 sm:p-4 bg-white border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>🖨 Imprimir Ticket</span>
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 transition-colors active:scale-95 shadow-warm"
          >
            <span>{isFromHistory ? 'Cerrar' : 'Nueva Venta'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
