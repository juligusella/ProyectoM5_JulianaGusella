import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  endAt,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
  updateDoc,
  where,
  type DocumentSnapshot,
  type QueryConstraint,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import type { CategoryId, Product } from '../../types/product'

const mapProduct = (
  document: DocumentSnapshot,
): Product => {
  const data = document.data()

  if (!data) {
    throw new Error('Documento de producto inválido.')
  }

  return {
    id: document.id,
    name: data.name,
    nameLower: data.nameLower,
    description: data.description,
    price: data.price,
    category: data.category,
    imageUrl: data.imageUrl,
    stock: data.stock,
  }
}

const productsCollection = collection(db, 'products')

export type ListProductsParams = {
  category?: CategoryId
  searchPrefix?: string
  pageSize?: number
  cursor?: DocumentSnapshot | null
}

export type ListProductsResult = {
  items: Product[]
  lastDoc: DocumentSnapshot | null
  hasNextPage: boolean
}

export const listProducts = async (
  params: ListProductsParams = {},
): Promise<ListProductsResult> => {
  const { category, searchPrefix, pageSize = 8, cursor } = params

  const constraints: QueryConstraint[] = []

  if (category) {
    constraints.push(where('category', '==', category))
  }

  if (searchPrefix && searchPrefix.length >= 2) {
    constraints.push(
      orderBy('nameLower'),
      startAt(searchPrefix),
      endAt(searchPrefix + '\uffff'),
    )
  }

  if (cursor) {
    constraints.push(startAfter(cursor))
  }

  constraints.push(limit(pageSize + 1))

  const productsQuery = query(
    productsCollection,
    ...constraints,
  )

  const snapshot = await getDocs(productsQuery)

  const hasNextPage = snapshot.docs.length > pageSize

  const docs = snapshot.docs.slice(0, pageSize)

  const items = docs.map(mapProduct)

  const lastDoc =
    docs.length > 0
      ? docs[docs.length - 1]
      : null

  return {
    items,
    lastDoc,
    hasNextPage,
  }
}

export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(productsCollection)

  return snapshot.docs.map(mapProduct)
}

export const getProductById = async (
  productId: string,
): Promise<Product | null> => {
  const productDoc = doc(productsCollection, productId)
  const snapshot = await getDoc(productDoc)

  if (!snapshot.exists()) {
    return null
  }

  return mapProduct(snapshot)
}

export const getProductsByCategory = async (
  category: CategoryId,
): Promise<Product[]> => {
  const categoryQuery = query(
    productsCollection,
    where('category', '==', category),
  )

  const snapshot = await getDocs(categoryQuery)

  return snapshot.docs.map(mapProduct)
}

export const createProduct = async (
  product: Omit<Product, 'id'>,
): Promise<string> => {
  const productDoc = await addDoc(productsCollection, product)

  return productDoc.id
}

export const updateProduct = async (
  productId: string,
  product: Omit<Product, 'id'>,
): Promise<void> => {
  const productDoc = doc(productsCollection, productId)

  await updateDoc(productDoc, product)
}

export const deleteProduct = async (
  productId: string,
): Promise<void> => {
  const productDoc = doc(productsCollection, productId)

  await deleteDoc(productDoc)
}

