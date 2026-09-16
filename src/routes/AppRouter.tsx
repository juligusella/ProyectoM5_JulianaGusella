import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Catalog from '../pages/Catalog'
import Favorites from '../pages/favorites/Favorites'
import Cart from '../pages/cart/Cart'
import ProductDetail from '../pages/products/ProductDetail'
import Checkout from '../pages/checkout/Checkout'
import Register from '../pages/auth/Register'
import Login from '../pages/auth/Login'

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:category" element={<Catalog />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    )
}

export default AppRouter