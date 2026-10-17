import { Product } from '../types'

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Vestido Midi Floral Piura',
    category: 'Vestidos',
    sku: 'VES-MID-01',
    barcode: '775123400101',
    price: 129.00,
    colors: [
      { name: 'Amarillo Sol', hex: '#FFD54F' },
      { name: 'Crema Marfil', hex: '#FFF7E1' },
      { name: 'Verde Salvia', hex: '#A3B454' },
    ],
    sizes: [
      { size: 'S', stock: 6 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 5 },
      { size: 'XL', stock: 2 }, // Low stock variant
    ],
    minStockThreshold: 3,
    imageTag: 'vestido-midi',
    description: 'Vestido midi en chalis premium con estampado botánico sullanero y lazo regulable en cintura.'
  },
  {
    id: 'prod-002',
    name: 'Blusa Lino Escote V Sullana',
    category: 'Blusas & Tops',
    sku: 'BLU-LIN-02',
    barcode: '775123400102',
    price: 69.00,
    colors: [
      { name: 'Blanco Puro', hex: '#FFFFFF' },
      { name: 'Mantequilla', hex: '#FFE8A1' },
      { name: 'Melocotón', hex: '#FFB366' },
    ],
    sizes: [
      { size: 'S', stock: 8 },
      { size: 'M', stock: 14 },
      { size: 'L', stock: 7 },
      { size: 'XL', stock: 4 },
    ],
    minStockThreshold: 3,
    imageTag: 'blusa-lino',
    description: 'Blusa fresca 100% lino transpirable, corte holgado ideal para el clima cálido norteño.'
  },
  {
    id: 'prod-003',
    name: 'Pantalón Wide Leg Denim Vintage',
    category: 'Jeans & Pantalones',
    sku: 'JEA-WID-03',
    barcode: '775123400103',
    price: 149.00,
    colors: [
      { name: 'Azul Celeste', hex: '#93C5FD' },
      { name: 'Azul Índigo', hex: '#1E3A8A' },
      { name: 'Arena Suave', hex: '#E7E5E4' },
    ],
    sizes: [
      { size: 'S', stock: 5 },
      { size: 'M', stock: 9 },
      { size: 'L', stock: 3 }, // critical stock
      { size: 'XL', stock: 1 }, // critical stock
    ],
    minStockThreshold: 3,
    imageTag: 'pantalon-wide',
    description: 'Denim rígido 100% algodón con silueta de pernera ancha y tiro ultra alto estilizado.'
  },
  {
    id: 'prod-004',
    name: 'Conjunto Lino Boho Sol y Arena',
    category: 'Conjuntos',
    sku: 'CON-BOH-04',
    barcode: '775123400104',
    price: 189.00,
    colors: [
      { name: 'Dorado Cálido', hex: '#FFD54F' },
      { name: 'Terracota', hex: '#C25E34' },
      { name: 'Crudo Natural', hex: '#F5F5F0' },
    ],
    sizes: [
      { size: 'S', stock: 4 },
      { size: 'M', stock: 7 },
      { size: 'L', stock: 4 },
      { size: 'XL', stock: 3 },
    ],
    minStockThreshold: 3,
    imageTag: 'conjunto-boho',
    description: 'Top halter cruzado con falda cruzada fluida en mezcla de lino rústico y viscosa sedosa.'
  },
  {
    id: 'prod-005',
    name: 'Vestido Satinado Fiesta Esmeralda',
    category: 'Vestidos',
    sku: 'VES-SAT-05',
    barcode: '775123400105',
    price: 169.00,
    colors: [
      { name: 'Verde Botánico', hex: '#4D5B18' },
      { name: 'Oro Champagne', hex: '#E5C158' },
      { name: 'Cereza Intenso', hex: '#881337' },
    ],
    sizes: [
      { size: 'S', stock: 3 },
      { size: 'M', stock: 6 },
      { size: 'L', stock: 2 }, // critical
      { size: 'XL', stock: 0 }, // Out of stock to test disabled state
    ],
    minStockThreshold: 3,
    imageTag: 'vestido-fiesta',
    description: 'Satén pesado con caída impecable, abertura lateral sutil y tirantes ajustables.'
  },
  {
    id: 'prod-006',
    name: 'Top Corto Ribbed Sunshine',
    category: 'Blusas & Tops',
    sku: 'TOP-RIB-06',
    barcode: '775123400106',
    price: 49.00,
    colors: [
      { name: 'Amarillo Sol', hex: '#FFD54F' },
      { name: 'Blanco Tiza', hex: '#F8FAFC' },
      { name: 'Negro Azabache', hex: '#1C1917' },
    ],
    sizes: [
      { size: 'S', stock: 15 },
      { size: 'M', stock: 18 },
      { size: 'L', stock: 11 },
      { size: 'XL', stock: 6 },
    ],
    minStockThreshold: 3,
    imageTag: 'top-ribbed',
    description: 'Top acanalado de tejido elástico de alto gramaje con cuello redondo minimalista.'
  },
  {
    id: 'prod-007',
    name: 'Jeans Mom Fit Tiro Alto',
    category: 'Jeans & Pantalones',
    sku: 'JEA-MOM-07',
    barcode: '775123400107',
    price: 139.00,
    colors: [
      { name: 'Azul Medio Lavado', hex: '#3B82F6' },
      { name: 'Blanco Hueso', hex: '#F5F5F4' },
      { name: 'Negro Gastado', hex: '#292524' },
    ],
    sizes: [
      { size: 'S', stock: 7 },
      { size: 'M', stock: 10 },
      { size: 'L', stock: 5 },
      { size: 'XL', stock: 2 }, // critical
    ],
    minStockThreshold: 3,
    imageTag: 'jeans-mom',
    description: 'Corte cónico clásico de los 90 con ajuste ceñido en cintura y holgado en cadera.'
  },
  {
    id: 'prod-008',
    name: 'Conjunto Blazer & Short Terracota',
    category: 'Conjuntos',
    sku: 'CON-BLA-08',
    barcode: '775123400108',
    price: 219.00,
    colors: [
      { name: 'Terracota', hex: '#B45309' },
      { name: 'Beige Cálido', hex: '#D6C0A4' },
      { name: 'Verde Oliva', hex: '#556B2F' },
    ],
    sizes: [
      { size: 'S', stock: 4 },
      { size: 'M', stock: 5 },
      { size: 'L', stock: 3 },
      { size: 'XL', stock: 1 }, // critical
    ],
    minStockThreshold: 3,
    imageTag: 'conjunto-blazer',
    description: 'Blazer sastre ligero sin forro estructurado con short de pretina ancha con pinzas.'
  },
  {
    id: 'prod-009',
    name: 'Vestido Camisero Algodón Pima',
    category: 'Vestidos',
    sku: 'VES-CAM-09',
    barcode: '775123400109',
    price: 139.00,
    colors: [
      { name: 'Rayas Celeste/Blanco', hex: '#BAE6FD' },
      { name: 'Arena del Desierto', hex: '#E2D9C8' },
      { name: 'Rosa Empolvado', hex: '#FBCFE8' },
    ],
    sizes: [
      { size: 'S', stock: 6 },
      { size: 'M', stock: 8 },
      { size: 'L', stock: 5 },
      { size: 'XL', stock: 3 },
    ],
    minStockThreshold: 3,
    imageTag: 'vestido-camisero',
    description: 'Confeccionado en 100% Algodón Pima peruano, botones nacarados y cinturón de la misma tela.'
  },
  {
    id: 'prod-010',
    name: 'Blusa Manga Abullonada Coral',
    category: 'Blusas & Tops',
    sku: 'BLU-COR-10',
    barcode: '775123400110',
    price: 79.00,
    colors: [
      { name: 'Coral Suave', hex: '#FB7185' },
      { name: 'Mantequilla', hex: '#FFE8A1' },
      { name: 'Lila Lavanda', hex: '#E9D5FF' },
    ],
    sizes: [
      { size: 'S', stock: 9 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 4 },
      { size: 'XL', stock: 2 }, // critical
    ],
    minStockThreshold: 3,
    imageTag: 'blusa-abullonada',
    description: 'Mangas globo con puño fruncido y cuello corazón, ideal para eventos de día o salidas chic.'
  },
  {
    id: 'prod-011',
    name: 'Pantalón Culotte Lino Beige',
    category: 'Jeans & Pantalones',
    sku: 'PAN-CUL-11',
    barcode: '775123400111',
    price: 119.00,
    colors: [
      { name: 'Lino Natural', hex: '#D7CCC8' },
      { name: 'Verde Eucalipto', hex: '#82954B' },
      { name: 'Negro Suave', hex: '#27272A' },
    ],
    sizes: [
      { size: 'S', stock: 5 },
      { size: 'M', stock: 8 },
      { size: 'L', stock: 0 }, // Out of stock
      { size: 'XL', stock: 3 },
    ],
    minStockThreshold: 3,
    imageTag: 'pantalon-culotte',
    description: 'Pantalón cropped holgado de tiro medio con bolsillos laterales y elástico posterior.'
  },
  {
    id: 'prod-012',
    name: 'Conjunto Dos Piezas Tropical Sullana',
    category: 'Conjuntos',
    sku: 'CON-TRO-12',
    barcode: '775123400112',
    price: 179.00,
    colors: [
      { name: 'Estampado Palmeras', hex: '#A3B454' },
      { name: 'Atardecer Piura', hex: '#FFB366' },
      { name: 'Azul Turquesa', hex: '#38BDF8' },
    ],
    sizes: [
      { size: 'S', stock: 5 },
      { size: 'M', stock: 9 },
      { size: 'L', stock: 6 },
      { size: 'XL', stock: 4 },
    ],
    minStockThreshold: 3,
    imageTag: 'conjunto-tropical',
    description: 'Kimono fluido estampado con pantalón palazzo a juego en seda fría de tacto ultra suave.'
  }
]
