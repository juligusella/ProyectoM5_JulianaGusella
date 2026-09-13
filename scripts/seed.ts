import 'dotenv/config'
import { initializeApp } from 'firebase/app'
import {
  addDoc,
  collection,
  getFirestore
} from 'firebase/firestore'
import type { CategoryId, Product } from '../src/types/product.ts'

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const CATALOG: Record<CategoryId, string[]> = {
  plantas: [
    'Monstera Deliciosa',
    'Ficus Lyrata',
    'Pothos Neon',
    'Calathea Orbifolia',
    'Sansevieria',
    'Zamioculca',
    'Philodendron Brasil',
    'Peperomia Obtusifolia',
  ],

  macetas: [
    'Maceta Cerámica Arena',
    'Maceta Terracota Clásica',
    'Maceta Cerámica Verde Salvia',
    'Maceta de Cemento Natural',
    'Maceta Colgante de Yute',
    'Maceta Colgante de Cerámica',
    'Soporte de Madera para Plantas',
    'Bandeja de Madera Natural',
  ],

  cultivo: [
    'Kit de Germinación',
    'Sustrato Universal',
    'Sustrato para Cactus',
    'Fertilizante Orgánico Líquido',
    'Semillas de Albahaca',
    'Semillas de Lavanda',
    'Set de Herramientas de Jardinería',
    'Tijera de Poda Compacta',
  ],

  terrarios: [
    'Terrario Bosque Mini',
    'Terrario Jardín Tropical',
    'Terrario Esfera',
    'Terrario Geométrico',
    'Kit Terrario Principiante',
    'Kit Terrario Bosque',
    'Musgo Preservado',
    'Piedras Decorativas Naturales',
  ],
}

const randomPrice = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const randomStock = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const createDescription = (
  name: string,
  category: CategoryId,
): string => {
  const descriptions: Record<CategoryId, string> = {
    plantas: `${name}, una especie ideal para aportar vida y verde a tus espacios.`,
    macetas: `${name}, una pieza pensada para complementar tus plantas y la decoración de tu hogar.`,
    cultivo: `${name}, un producto práctico para acompañar el cuidado y cultivo de tus plantas.`,
    terrarios: `${name}, una opción ideal para crear y mantener composiciones botánicas en espacios interiores.`,
  }

  return descriptions[category]
}

const categories = Object.entries(CATALOG) as [CategoryId, string[]][]

const products: Omit<Product, 'id'>[] = categories.flatMap(
  ([category, names]) =>
    names.map((name) => ({
      name,
      nameLower: name.toLowerCase(),
      description: createDescription(name, category),
      price: randomPrice(5000, 50000),
      category,
      imageUrl: `https://picsum.photos/seed/${encodeURIComponent(name)}/300/300`,
      stock: randomStock(0, 20),
    })),
)

const productsCollection = collection(db, 'products')

const seed = async () => {
  try {
    for (const product of products) {
      const productDoc = await addDoc(productsCollection, product)

      console.log(
        `Producto creado: ${product.name} (${productDoc.id})`,
      )
    }

    console.log(`Seed completado: ${products.length} productos creados.`)
  } catch (error) {
    console.error('Error al ejecutar el seed:', error)
    process.exit(1)
  }
}

seed()