import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { cartAPI } from './services/api';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProductCatalog from './pages/ProductCatalog';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import AdminProductsPage from './pages/AdminProductsPage';
import Dashboard from './pages/Dashboard';

export default function App() {
    const { user, loading } = useAuth();
    const [cartCount, setCartCount] = useState(0);

    const fetchCartCount = () => {
        if (!user) { setCartCount(0); return; }
        cartAPI.get()
            .then(res => setCartCount(res.data.totalItems || 0))
            .catch(() => setCartCount(0));
    };

    useEffect(() => { fetchCartCount(); }, [user]);

    if (loading) {
        return <div className="spinner" style={{ marginTop: '200px' }}></div>;
    }

    return (
        <>
            <Navbar cartCount={cartCount} />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/products" element={<ProductCatalog />} />
                <Route path="/products/:id" element={<ProductDetail onCartUpdate={fetchCartCount} />} />

                {/* Authenticated Routes */}
                <Route path="/cart" element={
                    <ProtectedRoute><CartPage onCartUpdate={fetchCartCount} /></ProtectedRoute>
                } />
                <Route path="/checkout" element={
                    <ProtectedRoute><CheckoutPage onCartUpdate={fetchCartCount} /></ProtectedRoute>
                } />
                <Route path="/orders" element={
                    <ProtectedRoute><OrdersPage /></ProtectedRoute>
                } />
                <Route path="/profile" element={
                    <ProtectedRoute><ProfilePage /></ProtectedRoute>
                } />

                <Route path="/dashboard" element={
                    <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />

                {/* Admin/Seller Routes */}
                <Route path="/admin/products" element={
                    <ProtectedRoute roles={['ADMIN', 'SELLER']}>
                        <AdminProductsPage />
                    </ProtectedRoute>
                } />

                {/* 404 */}
                <Route path="*" element={
                    <div className="page container" style={{ textAlign: 'center', paddingTop: '160px' }}>
                        <h1 style={{ fontSize: '4rem', marginBottom: '16px' }}>404</h1>
                        <p style={{ color: 'var(--gray-600)' }}>Page not found</p>
                    </div>
                } />
            </Routes>
        </>
    );
}
