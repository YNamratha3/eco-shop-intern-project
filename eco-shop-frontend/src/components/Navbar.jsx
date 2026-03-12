import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { toast } from 'react-toastify';
import './Navbar.css';

export default function Navbar({ cartCount }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (!confirmLogout) return;
        logout();
        toast.success("Logged out successfully");
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-inner">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">🌿</span>
                    <span className="brand-text">EcoShop</span>
                </Link>

                <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    <span></span><span></span><span></span>
                </button>

                <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    <Link to="/products" className="nav-link" onClick={() => setMenuOpen(false)}>Products</Link>

                    {user ? (
                        <>
                            <Link to="/cart" className="nav-link cart-link" onClick={() => setMenuOpen(false)}>
                                🛒 Cart
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </Link>
                            <Link to="/orders" className="nav-link" onClick={() => setMenuOpen(false)}>Orders</Link>
                            <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>

                            {(user.role === 'ADMIN' || user.role === 'SELLER') && (
                                <Link to="/admin/products" className="nav-link" onClick={() => setMenuOpen(false)}>Manage</Link>
                            )}
                            <div className="nav-user">
                                <Link to="/profile" className="nav-link user-link" onClick={() => setMenuOpen(false)}>
                                    <span className="user-avatar">{user.username[0].toUpperCase()}</span>
                                    {user.username}
                                </Link>
                                <button className="btn btn-sm btn-secondary" onClick={handleLogout}>Logout</button>
                            </div>
                        </>
                    ) : (
                        <div className="nav-auth">
                            <Link to="/login" className="btn btn-sm btn-secondary" onClick={() => setMenuOpen(false)}>Login</Link>
                            <Link to="/signup" className="btn btn-sm btn-primary" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
