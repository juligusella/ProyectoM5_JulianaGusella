import type { Product } from '../types/product'
import type { User } from '../types/user'

export const productFixture: Product = {
    id: 'product-1',
    name: 'Monstera Deliciosa',
    nameLower: 'monstera deliciosa',
    description: 'Planta de interior de hojas verdes.',
    price: 15000,
    category: 'plantas',
    imageUrl: 'https://example.com/monstera.jpg',
    stock: 10,
}

export const secondProductFixture: Product = {
    id: 'product-2',
    name: 'Maceta de cerámica',
    nameLower: 'maceta de cerámica',
    description: 'Maceta artesanal de cerámica.',
    price: 8000,
    category: 'macetas',
    imageUrl: 'https://example.com/maceta.jpg',
    stock: 5,
}

export const customerFixture: User = {
    uid: 'customer-test-1',
    email: 'customer@test.com',
    displayName: 'Cliente de prueba',
    role: 'customer',
}

export const adminFixture: User = {
    uid: 'admin-test-1',
    email: 'admin@test.com',
    displayName: 'Admin de prueba',
    role: 'admin',
}
