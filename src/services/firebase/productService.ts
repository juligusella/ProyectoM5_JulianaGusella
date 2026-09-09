import {
  collection,
  getDocs,
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