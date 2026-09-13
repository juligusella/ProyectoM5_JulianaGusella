export type CategoryId =
  | 'plantas'
  | 'macetas'
  | 'cultivo'
  | 'terrarios'

export interface Product {
  id: string
  name: string
  nameLower: string
  description: string
  price: number
  category: CategoryId
  imageUrl: string
  stock: number
}
