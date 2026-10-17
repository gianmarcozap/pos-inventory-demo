import { Customer, SaleRecord } from '../types'

export const DEFAULT_CUSTOMER: Customer = {
  documentType: 'DNI',
  documentNumber: '00000000',
  name: 'Cliente General / Ocasional',
}

export const MOCK_CUSTOMERS_DB: Record<string, Customer> = {
  '72849102': {
    documentType: 'DNI',
    documentNumber: '72849102',
    name: 'María Fernanda Torres',
    email: 'mfernanda.torres@gmail.com',
    phone: '969 123 456',
    address: 'Urb. Santa Rosa Mz. B Lt. 14, Sullana'
  },
  '10458923': {
    documentType: 'DNI',
    documentNumber: '10458923',
    name: 'Lucía Valdiviezo Seminario',
    email: 'lucia.valdiviezo@hotmail.com',
    phone: '968 456 789',
    address: 'Calle San Martín 620, Sullana'
  },
  '43902184': {
    documentType: 'DNI',
    documentNumber: '43902184',
    name: 'Carmen Rosa García Mogollón',
    email: 'carmen.garcia.m@outlook.com',
    phone: '969 987 654',
    address: 'Av. Champagnat 342, Sullana'
  },
  '71290483': {
    documentType: 'DNI',
    documentNumber: '71290483',
    name: 'Ana Claudia Castillo Silva',
    email: 'anaclaudia.castillo@gmail.com',
    phone: '970 334 112',
    address: 'Calle Bolivar 189, Bellavista, Sullana'
  },
  '09845120': {
    documentType: 'DNI',
    documentNumber: '09845120',
    name: 'Valeria Mendoza Cruz',
    email: 'valeria.mendoza@gmail.com',
    phone: '965 221 889',
    address: 'Residencial Grau D-2, Sullana'
  },
  '20601234567': {
    documentType: 'RUC',
    documentNumber: '20601234567',
    name: 'INVERSIONES CHIRA SULLANA S.A.C.',
    email: 'facturacion@inversioneschira.pe',
    phone: '073 502211',
    address: 'Calle Tarapacá 415, Sullana, Piura'
  }
}

export function simulateDniLookup(docNum: string): Promise<Customer> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const clean = docNum.trim()
      if (MOCK_CUSTOMERS_DB[clean]) {
        resolve({ ...MOCK_CUSTOMERS_DB[clean] })
      } else if (clean.length === 8) {
        // Realistic simulated RENIEC lookup
        const names = [
          'Camila Andrea Flores Ruesta',
          'Fiorella Beatriz Ramos Nizama',
          'Diana Elizabeth Morales Carreño',
          'Jessica Paola Ordinola León',
          'Gabriela Sofía Palacios Farfán'
        ]
        const idx = Math.abs(clean.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % names.length
        resolve({
          documentType: 'DNI',
          documentNumber: clean,
          name: names[idx],
          email: `${names[idx].toLowerCase().split(' ')[0]}.${clean.slice(-3)}@gmail.com`,
          address: 'Sullana, Piura, Perú'
        })
      } else if (clean.length === 11) {
        resolve({
          documentType: 'RUC',
          documentNumber: clean,
          name: 'COMERCIAL & BOUTIQUE NORTEÑA S.R.L.',
          email: 'contacto@nortenaboutique.pe',
          address: 'Sullana, Piura, Perú'
        })
      } else {
        resolve({
          documentType: 'DNI',
          documentNumber: clean || '00000000',
          name: clean ? `Cliente DNI ${clean}` : 'Cliente General',
        })
      }
    }, 150)
  })
}

export const INITIAL_PRELOADED_SALES: SaleRecord[] = [
  {
    id: 'sale-001',
    serie: 'B001',
    correlativo: '000480',
    numeroCompleto: 'B001-000480',
    timestamp: '2025-05-14T09:42:15',
    customer: {
      documentType: 'DNI',
      documentNumber: '10458923',
      name: 'Lucía Valdiviezo Seminario',
      email: 'lucia.valdiviezo@hotmail.com',
      phone: '968 456 789'
    },
    items: [
      {
        cartItemId: 'prod-001-M-Amarillo Sol',
        productId: 'prod-001',
        name: 'Vestido Midi Floral Piura',
        category: 'Vestidos',
        sku: 'VES-MID-01',
        barcode: '775123400101',
        size: 'M',
        color: { name: 'Amarillo Sol', hex: '#FFD54F' },
        unitPrice: 129.00,
        quantity: 1,
        maxStock: 12
      }
    ],
    subtotalGravado: 109.32,
    igv: 19.68,
    descuento: 0,
    total: 129.00,
    paymentMethod: 'TARJETA',
    montoRecibido: 129.00,
    vuelto: 0,
    hashSunat: 'Q2Z0kL9P8w7RtX3yN1m==',
    cajero: 'Gianmarco M.'
  },
  {
    id: 'sale-002',
    serie: 'B001',
    correlativo: '000481',
    numeroCompleto: 'B001-000481',
    timestamp: '2025-05-14T11:15:30',
    customer: {
      documentType: 'DNI',
      documentNumber: '43902184',
      name: 'Carmen Rosa García Mogollón',
      email: 'carmen.garcia.m@outlook.com',
      phone: '969 987 654'
    },
    items: [
      {
        cartItemId: 'prod-002-S-Blanco Puro',
        productId: 'prod-002',
        name: 'Blusa Lino Escote V Sullana',
        category: 'Blusas & Tops',
        sku: 'BLU-LIN-02',
        barcode: '775123400102',
        size: 'S',
        color: { name: 'Blanco Puro', hex: '#FFFFFF' },
        unitPrice: 69.00,
        quantity: 1,
        maxStock: 8
      },
      {
        cartItemId: 'prod-006-M-Amarillo Sol',
        productId: 'prod-006',
        name: 'Top Corto Ribbed Sunshine',
        category: 'Blusas & Tops',
        sku: 'TOP-RIB-06',
        barcode: '775123400106',
        size: 'M',
        color: { name: 'Amarillo Sol', hex: '#FFD54F' },
        unitPrice: 49.00,
        quantity: 1,
        maxStock: 18
      }
    ],
    subtotalGravado: 100.00,
    igv: 18.00,
    descuento: 0,
    total: 118.00,
    paymentMethod: 'YAPE_PLIN',
    montoRecibido: 118.00,
    vuelto: 0,
    hashSunat: 'm8k9Vb4Xr7Ls2Pn0Jq1==',
    cajero: 'Gianmarco M.'
  }
]
