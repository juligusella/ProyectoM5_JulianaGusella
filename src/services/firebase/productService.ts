import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from './config'
import type { Product } from '../../types/product'

const productsCollection = collection(db, 'products')

export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(productsCollection)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[]
}

export const getProductById = async (
  productId: string,
): Promise<Product | null> => {
  const productDoc = doc(productsCollection, productId)
  const snapshot = await getDoc(productDoc)

  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Product
}

export const getProductsByCategory = async (
  category: string,
): Promise<Product[]> => {
  const categoryQuery = query(
    productsCollection,
    where('category', '==', category),
  )

  const snapshot = await getDocs(categoryQuery)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[]
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