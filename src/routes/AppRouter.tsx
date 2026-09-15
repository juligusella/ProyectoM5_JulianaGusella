import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Catalog from '../pages/Catalog'
import Favorites from '../pages/favorites/Favorites'
import Cart from '../pages/cart/Cart'

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:category" element={<Catalog />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/cart" element={<Cart />} />
        </Routes>
    )
}

export default AppRouter