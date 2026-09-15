import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Catalog from '../pages/Catalog'
import Favorites from '../pages/favorites/Favorites'
import Cart from '../pages/cart/Cart'
import ProductDetail from '../pages/products/ProductDetail'

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:category" element={<Catalog />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
    )
}

export default AppRouter