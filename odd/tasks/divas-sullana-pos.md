# Divas Sullana POS · Boutique - Terminal Implementation
Autonomous implementation of terminal-style point-of-sale for Divas Sullana Boutique in Sullana, Piura, Peru.
React 19 + TypeScript + Tailwind CSS + Zustand in-memory state.

## Specs
- S1: Palette enforcement - Warm off-white canvas (`#FFFDF7` / `bg-[#FAF9F5]`), pure white cards with warm borders (`border-[#FFE8A1]/60` or `border-stone-200/70`), Deep Charcoal Espresso text (`#1C1917` / `text-stone-900`), Muted stone (`#78716C`), Sunshine Yellow (`#FFD54F`), Soft Butter (`#FFE8A1`), Warm Cream (`#FFF7E1`), Peach Glow (`#FFB366`), Sunlit Green (`#A3B454`), and high-contrast checkout CTA (`bg-[#2563EB]` / `bg-stone-900`).
- S2: Viewport framing - Single-screen viewport `100vh` without chaotic double scrollbars. Top header `h-14`, main POS `h-[calc(100vh-3.5rem)]` with 65% catalog / 35% cart split.
- S3: Product catalog - 12 realistic fashion apparel items with SKU, price in Soles (`S/`), color swatch dots, size pills (`S`, `M`, `L`, `XL`), and live stock badges (`Stock: 18` in Sunlit Green, `Stock: 2` in Peach Glow low stock, or `Agotado`). Click variant to select, click card/button to add to cart.
- S4: Barcode / SKU scanner simulation - Input field "Escanear código de barras o buscar prenda..." supporting instant scan by barcode or SKU with auto-addition or search filtering.
- S5: Peruvian DNI / RUC API simulation - Customer lookup input with "Autocompletar DNI" simulating query `72849102 · María Fernanda Torres` or manual DNI entry.
- S6: Active cart & financial summary - Quantity increment/decrement, remove item, subtotal, discount, IGV (18%), and prominent bold Total.
- S7: Payment methods & Hold sale - Radio pills for `Efectivo` (with cash tendered and change calculator), `Yape / Plin`, `Tarjeta`. Secondary actions: `Poner en Espera (Hold)` and `Cancelar / Limpiar Carrito`.
- S8: Atomic stock deduction - Completing sale deducts exact variant stock in store. Items dropping below 3 units show `Stock Crítico` in Peach Glow; 0 units disables addition with `Agotado`.
- S9: SUNAT-compliant electronic Boleta modal - Header `DIVAS SULLANA S.A.C. · RUC 20601234567`, document `BOLETA DE VENTA ELECTRÓNICA B001-XXXXXX`, customer details, itemized breakdown, IGV breakdown, total in S/, QR simulation, print and new sale actions.
- S10: Inventario & Stock tab - Data table listing SKUs, categories, size variants, physical stock vs min threshold, and "+ Ajustar Stock" modal for restocking.
- S11: Historial de Ventas & Cierre de Caja tab - Daily summary cards (Total Recaudado Hoy, Ventas Efectivo, Ventas Yape/Plin, Transacciones), timeline of completed sales, and receipt re-print capability.
- S12: Demo reset - Reloading or clicking `↻ Reiniciar datos` restores catalog, sales, and caja to pristine demo state.

## Tasks
- T1: S2 | Scaffolding Vite + React 19 + TypeScript + Tailwind CSS + Lucide Icons + Zustand | pending
- T2: S3, S5, S8, S12 | Data layer & Zustand store with 12 realistic fashion products, DNI simulation, sales history, held carts, and reset | pending
- T3: S1, S2, S12 | Header component with branding, navigation tabs, caja balance, demo badge, and reset trigger | pending
- T4: S1, S3, S4, S8 | Left section: Search/barcode scanner, category filter pills, and product grid with variants and stock indicators | pending
- T5: S1, S5, S6, S7 | Right section: Cart item list, DNI lookup, subtotal/IGV/total calculator, payment method with change calculation, hold/cancel | pending
- T6: S8, S9 | SUNAT Electronic Boleta modal with print simulation, QR code, itemization, and atomic stock deduction trigger | pending
- T7: S10 | Inventario & Stock view with SKU table, category filter, low-stock alerts, and Adjust Stock modal | pending
- T8: S11 | Historial de Ventas & Cierre de Caja view with daily metrics cards, sales timeline, and reprint modal | pending
- T9: S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12 | Integration polish, audio/visual cues, keyboard shortcuts, and build validation | pending

## Log
- L1: User prompt received requesting complete "Divas Sullana POS · Boutique" single-screen terminal POS application with exact Warm Botanical/Sunshine color palette tokens, 100vh viewport framing, zero-placeholder policy, SUNAT Boleta modal, Inventario & Ventas tabs, and atomic stock deduction.
