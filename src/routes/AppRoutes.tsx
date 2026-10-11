import { Navigate, Route, Routes } from 'react-router-dom'

import Home from '../pages/Home'
import Catalog from '../pages/Catalog'
import Favorites from '../pages/favorites/Favorites'
import Cart from '../pages/cart/Cart'
import ProductDetail from '../pages/products/ProductDetail'
import Checkout from '../pages/checkout/Checkout'
import Register from '../pages/auth/Register'
import Login from '../pages/auth/Login'

import { AdminRoute } from './AdminRoute'
import { AdminLayout } from '../components/layout/AdminLayout'
import { AdminProductList } from '../components/common/admin/AdminProductList'
import { AdminProductForm } from '../components/common/admin/AdminProductForm'
import { AdminOrderList } from '../components/common/admin/AdminOrderList'

const AppRouter = () => {
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />

            <Route path="/catalog" element={<Catalog />} />

            <Route
                path="/catalog/:category"
                element={<Catalog />}
            />

            <Route path="/cart" element={<Cart />} />

            <Route path="/checkout" element={<Checkout />} />

            <Route
                path="/favorites"
                element={<Favorites />}
            />

            <Route
                path="/product/:id"
                element={<ProductDetail />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            {/* Panel de administración */}
            <Route element={<AdminRoute />}>
                <Route
                    path="/admin"
                    element={<AdminLayout />}
                >
                    <Route
                        index
                        element={
                            <Navigate
                                to="products"
                                replace
                            />
                        }
                    />

                    <Route
                        path="products"
                        element={<AdminProductList />}
                    />

                    <Route
                        path="products/new"
                        element={<AdminProductForm />}
                    />

                    <Route
                        path="products/:id/edit"
                        element={<AdminProductForm />}
                    />

                    <Route
                        path="orders"
                        element={<AdminOrderList />}
                    />
                </Route>
            </Route>
        </Routes>
    )
}

export default AppRouter